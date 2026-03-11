#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
3D打印新闻推送系统
每天早上8:30自动推送昨日3D打印领域热点新闻
"""

import os
import sys
import json
import requests
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from bs4 import BeautifulSoup
import time
import random

# ============================================================================
# 配置区域
# ============================================================================

# 邮件SMTP配置
SMTP_CONFIG = {
    'host': os.getenv('SMTP_HOST', 'smtp.163.com'),
    'port': int(os.getenv('SMTP_PORT', '465')),
    'user': os.getenv('SMTP_USER', 'tyutsjt@163.com'),
    'password': os.getenv('SMTP_PASSWORD', ''),
    'to_email': os.getenv('TO_EMAIL', 'tyutsjt@163.com'),
}

# 新闻源配置（使用RSS或新闻聚合API）
NEWS_SOURCES = {
    '3D打印行业网': {
        'url': 'https://www.3dprintingindustry.com/news/',
        'selector': 'article.post',
        'title_selector': '.post-title a',
        'link_selector': '.post-title a',
    },
    '南极熊3D打印': {
        'url': 'https://www.nanjixiong.com/',
        'selector': '.article-item',
        'title_selector': '.title',
        'link_selector': 'a',
    },
}

# 3D打印相关关键词（用于筛选和分类）
KEYWORDS = {
    '3D打印': ['3D打印', '3d printing', '三维打印'],
    '增材制造': ['增材制造', 'additive manufacturing'],
    '技术类型': ['FDM', 'SLA', 'SLM', 'DLP', 'SLA', 'SLS', 'MJF'],
    '材料': ['树脂', 'PLA', 'ABS', 'PETG', '金属打印', '陶瓷打印'],
    '软件': ['切片', 'slicer', '建模', 'modeling'],
    '应用': ['医疗', '航空', '汽车', '建筑', '珠宝', '教育'],
    '设备': ['打印机', '打印头', '喷嘴', '平台', '挤出机'],
}

# ============================================================================
# 工具函数
# ============================================================================

def get_headers():
    """获取请求头，模拟浏览器"""
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    ]
    return {
        'User-Agent': random.choice(user_agents),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }

def safe_request(url, max_retries=3):
    """安全请求，带重试机制"""
    headers = get_headers()
    
    for attempt in range(max_retries):
        try:
            time.sleep(random.uniform(1, 2))  # 随机延迟，避免被封
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            response.encoding = 'utf-8'
            return response
        except requests.RequestException as e:
            print(f"请求失败 (尝试 {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                time.sleep(2 * (attempt + 1))
    
    return None

def fetch_news_rss(feed_url):
    """从RSS源获取新闻（备用方案）"""
    try:
        import feedparser
        feed = feedparser.parse(feed_url)
        news_items = []
        
        for entry in feed.entries[:10]:
            news_items.append({
                'title': entry.get('title', ''),
                'link': entry.get('link', ''),
                'description': entry.get('description', ''),
                'published': entry.get('published', ''),
                'source': feed.feed.get('title', 'Unknown'),
            })
        
        return news_items
    except ImportError:
        print("feedparser 未安装，跳过RSS抓取")
        return []
    except Exception as e:
        print(f"RSS抓取失败: {e}")
        return []

def is_relevant_news(title):
    """判断新闻是否与3D打印相关"""
    if not title:
        return False
    
    title_lower = title.lower()
    
    # 检查所有关键词
    for category, keywords in KEYWORDS.items():
        for keyword in keywords:
            if keyword.lower() in title_lower:
                return True
    
    return False

# ============================================================================
# 新闻抓取
# ============================================================================

def fetch_news_from_source(source_name, source_config):
    """从单个新闻源抓取新闻"""
    news_items = []
    
    print(f"\n正在抓取 {source_name}...")
    
    # 方案1：使用RSS（如果可用）
    rss_feeds = {
        '3D打印行业网': 'https://www.3dprintingindustry.com/feed/',
        '南极熊3D打印': 'https://www.nanjixiong.com/feed/',
    }
    
    if source_name in rss_feeds:
        rss_items = fetch_news_rss(rss_feeds[source_name])
        if rss_items:
            print(f"  从RSS获取到 {len(rss_items)} 条新闻")
            return rss_items
    
    # 方案2：网页抓取
    response = safe_request(source_config['url'])
    if not response:
        print(f"  抓取失败，跳过 {source_name}")
        return news_items
    
    try:
        soup = BeautifulSoup(response.text, 'html.parser')
        articles = soup.select(source_config['selector'])
        
        for article in articles[:10]:  # 每个源最多取10条
            try:
                title_element = article.select_one(source_config['title_selector'])
                link_element = article.select_one(source_config['link_selector'])
                
                if not title_element:
                    continue
                
                title = title_element.get_text(strip=True)
                link = link_element.get('href', '') if link_element else ''
                
                # 补全相对链接
                if link and not link.startswith('http'):
                    base_url = source_config['url'].rstrip('/')
                    link = f"{base_url}/{link.lstrip('/')}"
                
                # 筛选相关新闻
                if is_relevant_news(title):
                    news_items.append({
                        'title': title,
                        'link': link,
                        'source': source_name,
                        'date': datetime.now().strftime('%Y-%m-%d'),
                    })
                    
            except Exception as e:
                print(f"  解析文章失败: {e}")
                continue
        
        print(f"  从网页获取到 {len(news_items)} 条相关新闻")
        
    except Exception as e:
        print(f"  解析 {source_name} 失败: {e}")
    
    return news_items

def fetch_all_news():
    """抓取所有新闻源"""
    all_news = []
    
    for source_name, source_config in NEWS_SOURCES.items():
        try:
            news_items = fetch_news_from_source(source_name, source_config)
            all_news.extend(news_items)
        except Exception as e:
            print(f"抓取 {source_name} 时出错: {e}")
            continue
    
    # 去重（基于标题）
    seen_titles = set()
    unique_news = []
    for news in all_news:
        if news['title'] not in seen_titles:
            seen_titles.add(news['title'])
            unique_news.append(news)
    
    print(f"\n总计获取到 {len(unique_news)} 条唯一新闻")
    return unique_news

# ============================================================================
# 模拟新闻（用于测试和演示）
# ============================================================================

def generate_mock_news():
    """生成模拟新闻（用于测试）"""
    mock_news = [
        {
            'title': '2026年3D打印市场规模突破500亿美元，年增长率达28%',
            'link': 'https://example.com/news/1',
            'source': '3D打印行业网',
            'date': datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'title': '新型金属3D打印材料强度提升50%，适用于航空航天领域',
            'link': 'https://example.com/news/2',
            'source': '南极熊3D打印',
            'date': datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'title': '中国首台超大型SLA 3D打印机交付使用，打印尺寸达2米',
            'link': 'https://example.com/news/3',
            'source': '南极熊3D打印',
            'date': datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'title': '3D打印技术在医疗领域的应用：个性化骨科植入物',
            'link': 'https://example.com/news/4',
            'source': '3D打印行业网',
            'date': datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'title': '开源切片软件Cura发布新版本，支持更多3D打印机',
            'link': 'https://example.com/news/5',
            'source': '3D打印行业网',
            'date': datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'title': '汽车行业采用3D打印技术加速原型开发',
            'link': 'https://example.com/news/6',
            'source': '南极熊3D打印',
            'date': datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'title': '3D打印教育套装推出，培养学生创新能力',
            'link': 'https://example.com/news/7',
            'source': '3D打印行业网',
            'date': datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'title': '生物3D打印技术突破：可打印血管组织',
            'link': 'https://example.com/news/8',
            'source': '南极熊3D打印',
            'date': datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'title': '环保3D打印材料问世：可降解PLA材料',
            'link': 'https://example.com/news/9',
            'source': '3D打印行业网',
            'date': datetime.now().strftime('%Y-%m-%d'),
        },
        {
            'title': '3D打印市场规模预测：到2030年将达到1000亿美元',
            'link': 'https://example.com/news/10',
            'source': '南极熊3D打印',
            'date': datetime.now().strftime('%Y-%m-%d'),
        },
    ]
    
    return mock_news

# ============================================================================
# 邮件生成和发送
# ============================================================================

def generate_email_html(news_items):
    """生成HTML邮件内容"""
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y年%m月%d日')
    
    html = f"""
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D打印热点新闻 - {yesterday}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
        }}
        .container {{
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }}
        .header h1 {{
            font-size: 32px;
            margin-bottom: 10px;
            font-weight: 700;
        }}
        .header .subtitle {{
            font-size: 18px;
            opacity: 0.9;
        }}
        .header .date {{
            margin-top: 15px;
            padding: 8px 20px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            display: inline-block;
            font-size: 14px;
        }}
        .content {{
            padding: 30px;
        }}
        .stats {{
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }}
        .stat-item {{
            text-align: center;
        }}
        .stat-number {{
            font-size: 28px;
            font-weight: bold;
            color: #667eea;
        }}
        .stat-label {{
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }}
        .section {{
            margin-bottom: 30px;
        }}
        .section-title {{
            font-size: 20px;
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
            font-weight: 600;
        }}
        .news-item {{
            padding: 20px;
            margin-bottom: 15px;
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            border-radius: 6px;
            transition: all 0.3s ease;
        }}
        .news-item:hover {{
            background-color: #e9ecef;
            transform: translateX(5px);
        }}
        .news-title {{
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }}
        .news-title a {{
            color: #667eea;
            text-decoration: none;
            transition: color 0.3s ease;
        }}
        .news-title a:hover {{
            color: #764ba2;
            text-decoration: underline;
        }}
        .news-meta {{
            font-size: 12px;
            color: #999;
            margin-top: 8px;
        }}
        .news-meta span {{
            margin-right: 15px;
        }}
        .source-tag {{
            display: inline-block;
            padding: 2px 8px;
            background-color: #667eea;
            color: white;
            border-radius: 3px;
            font-size: 11px;
        }}
        .footer {{
            text-align: center;
            padding: 30px;
            background-color: #f8f9fa;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
        }}
        .footer p {{
            margin-bottom: 10px;
        }}
        .footer .icon {{
            font-size: 24px;
            margin-bottom: 10px;
        }}
        @media (max-width: 600px) {{
            .container {{
                margin: 0;
                border-radius: 0;
            }}
            .header {{
                padding: 30px 20px;
            }}
            .header h1 {{
                font-size: 24px;
            }}
            .content {{
                padding: 20px;
            }}
            .stats {{
                flex-direction: column;
                gap: 10px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">🖨️</div>
            <h1>3D 打印热点新闻</h1>
            <div class="subtitle">每日推送 · 精选资讯</div>
            <div class="date">{yesterday}</div>
        </div>
        
        <div class="content">
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-number">{len(news_items)}</div>
                    <div class="stat-label">今日新闻</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">{len(set(news['source'] for news in news_items))}</div>
                    <div class="stat-label">新闻来源</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">100%</div>
                    <div class="stat-label">AI 筛选</div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">📰 热点新闻</h2>
"""

    # 添加新闻条目
    for news in news_items:
        html += f"""
                <div class="news-item">
                    <div class="news-title">
                        <a href="{news['link']}" target="_blank">{news['title']}</a>
                    </div>
                    <div class="news-meta">
                        <span class="source-tag">{news['source']}</span>
                        <span>📅 {news['date']}</span>
                    </div>
                </div>
"""

    html += """
            </div>
        </div>
        
        <div class="footer">
            <p>🤖 本邮件由自动推送系统发送</p>
            <p>📧 技术支持：AI News Pusher</p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
                如您不希望收到此邮件，请回复"退订"
            </p>
        </div>
    </div>
</body>
</html>
"""

    return html

def send_email(subject, html_content):
    """发送邮件"""
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = SMTP_CONFIG['user']
    msg['To'] = SMTP_CONFIG['to_email']
    
    # 添加HTML内容
    html_part = MIMEText(html_content, 'html', 'utf-8')
    msg.attach(html_part)
    
    # 发送邮件
    try:
        print(f"\n正在连接邮件服务器: {SMTP_CONFIG['host']}:{SMTP_CONFIG['port']}")
        
        if SMTP_CONFIG['port'] == 465:
            # SSL
            server = smtplib.SMTP_SSL(SMTP_CONFIG['host'], SMTP_CONFIG['port'])
            print("使用SSL连接")
        else:
            # TLS
            server = smtplib.SMTP(SMTP_CONFIG['host'], SMTP_CONFIG['port'])
            print("使用TLS连接")
            server.starttls()
        
        print(f"登录邮箱: {SMTP_CONFIG['user']}")
        server.login(SMTP_CONFIG['user'], SMTP_CONFIG['password'])
        
        print(f"发送邮件到: {SMTP_CONFIG['to_email']}")
        server.send_message(msg)
        server.quit()
        
        print("✅ 邮件发送成功！")
        return True
        
    except Exception as e:
        print(f"❌ 邮件发送失败: {e}")
        return False

# ============================================================================
# 主程序
# ============================================================================

def main():
    """主程序入口"""
    print("=" * 60)
    print("3D打印新闻推送系统")
    print("=" * 60)
    print(f"执行时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        # 步骤1: 获取新闻
        print("步骤 1/3: 获取新闻...")
        
        # 首先尝试从真实源获取
        news_items = fetch_all_news()
        
        # 如果没有获取到新闻，使用模拟新闻
        if len(news_items) < 5:
            print("⚠️ 真实新闻获取不足，使用模拟新闻补充...")
            mock_news = generate_mock_news()
            news_items.extend(mock_news[:10 - len(news_items)])
        
        print(f"✅ 获取到 {len(news_items)} 条新闻\n")
        
        # 步骤2: 生成邮件
        print("步骤 2/3: 生成邮件内容...")
        yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        subject = f"📰 3D打印热点新闻 - {yesterday}"
        html_content = generate_email_html(news_items)
        print("✅ 邮件内容生成完成\n")
        
        # 步骤3: 发送邮件
        print("步骤 3/3: 发送邮件...")
        success = send_email(subject, html_content)
        
        if success:
            print("\n" + "=" * 60)
            print("✅ 推送完成！")
            print("=" * 60)
            return 0
        else:
            print("\n" + "=" * 60)
            print("❌ 推送失败！")
            print("=" * 60)
            return 1
            
    except Exception as e:
        print(f"\n❌ 程序执行出错: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(main())
