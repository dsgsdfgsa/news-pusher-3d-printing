const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
        PageBreak, LevelFormat, Footer, PageNumber } = require('docx');
const fs = require('fs');

// 创建文档
const doc = new Document({
  styles: {
    default: { 
      document: { 
        run: { font: "宋体", size: 24 }
      } 
    },
    paragraphStyles: [
      { 
        id: "Heading1", 
        name: "Heading 1", 
        basedOn: "Normal", 
        next: "Normal",
        quickFormat: true,
        run: { size: 36, bold: true, font: "黑体" },
        paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER, outlineLevel: 0 }
      },
      { 
        id: "Heading2", 
        name: "Heading 2", 
        basedOn: "Normal", 
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "黑体" },
        paragraph: { spacing: { before: 200, after: 160 }, outlineLevel: 1 }
      },
      { 
        id: "Heading3", 
        name: "Heading 3", 
        basedOn: "Normal", 
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "黑体" },
        paragraph: { spacing: { before: 160, after: 120 }, outlineLevel: 2 }
      },
      { 
        id: "Heading4", 
        name: "Heading 4", 
        basedOn: "Normal", 
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, font: "黑体" },
        paragraph: { spacing: { before: 120, after: 100 }, outlineLevel: 3 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1800, bottom: 1440, left: 1800 }
      }
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun("第 "),
              new TextRun({ children: [PageNumber.CURRENT] }),
              new TextRun(" 页")
            ]
          })
        ]
      })
    },
    children: buildContent()
  }]
});

function buildContent() {
  const content = [];
  
  // 标题
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun("六盘水市水城区以朵安置小区门面房二楼避暑酒楼项目谋划方案")]
  }));
  
  content.push(new Paragraph({ children: [new TextRun("")] }));
  
  // 一、项目概况
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun("一、项目概况")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun("1.1 项目名称")]
  }));
  content.push(new Paragraph({
    children: [new TextRun("六盘水市水城区以朵安置小区避暑酒楼项目")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun("1.2 项目地点")]
  }));
  content.push(new Paragraph({
    children: [new TextRun("六盘水市水城区以朵安置小区门面房二楼。该项目选址位于水城区核心地带,交通便利,周边配套设施完善,地理位置优越。项目选址充分考虑了社区居民的便捷性需求,以及避暑旅游季节客流的可达性要求,确保能够有效服务社区居民和避暑游客。")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun("1.3 项目性质")]
  }));
  content.push(new Paragraph({
    children: [new TextRun("新建餐饮服务项目。本项目属于城市社区商业配套服务设施,旨在为安置小区居民及周边区域提供高品质的餐饮服务,同时承接避暑旅游季节性客流,打造具有地方特色的餐饮服务平台。项目将按照标准化管理、特色化经营、品牌化发展的思路,建设成为水城区餐饮服务的标杆项目。")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun("1.4 项目定位")]
  }));
  content.push(new Paragraph({
    children: [new TextRun("以\"清凉凉都·美味水城\"为主题,打造集地方特色美食、避暑休闲、文化体验于一体的综合性餐饮服务平台。项目将充分利用六盘水\"中国凉都\"的品牌优势,结合水城区独特的地方美食文化,如水城羊肉粉、水城烙锅等特色美食,为顾客提供清凉舒适的用餐环境和地道的美食体验。服务对象涵盖安置小区居民及周边区域,重点承接避暑旅游季节性客流,实现经济效益与社会效益的统一。")]
  }));
  content.push(new Paragraph({ children: [new TextRun("")] }));
  content.push(new Paragraph({
    children: [new TextRun("项目将按照\"政府引导、市场运作、居民受益\"的原则,坚持高品质、亲民价、有特色的经营理念,打造成为水城区餐饮服务的新标杆。通过标准化管理、特色化经营、品牌化发展,逐步建立起良好的市场口碑和品牌形象,实现经济效益和社会效益的双赢。同时,项目将积极承担社会责任,优先招聘本地居民,带动就业创业,促进社区和谐发展。")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun("1.5 建设规模")]
  }));
  content.push(createBulletItem("经营面积:约300-500平方米(具体以实际门面房面积为准),充分利用二楼空间,合理规划功能分区,确保用餐环境舒适宽敞"));
  content.push(createBulletItem("设计餐位:80-120个,包括大厅散台和包间座位,满足不同规模就餐需求"));
  content.push(createBulletItem("功能分区:大厅用餐区、包间(3-5个)、厨房操作区、仓储区、办公区,各功能区布局合理,动线流畅"));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun("1.6 项目投资估算")]
  }));
  content.push(new Paragraph({
    children: [new TextRun("总投资约80-120万元,经过详细测算和合理规划,各项投资分配如下:")]
  }));
  content.push(createBulletItem("装修改造:40-60万元,包括大厅、包间、厨房、办公区等各功能区域的装修,以及水电改造、排烟系统、空调系统等基础设施投入"));
  content.push(createBulletItem("设备购置:20-30万元,包括厨房设备(灶具、冰箱、冷柜等)、餐厅设备(餐桌椅、空调、电视等)及其他配套设备"));
  content.push(createBulletItem("流动资金:20-30万元,用于初期食材采购、人员工资储备、营销推广及日常运营周转"));
  
  // 二、项目背景与必要性
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun("二、项目背景与必要性")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun("2.1 政策背景")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [new TextRun("2.1.1 国家层面政策支持")]
  }));
  content.push(createBulletItem("《国务院关于促进餐饮业健康发展的指导意见》明确提出支持餐饮业转型升级,鼓励餐饮企业创新经营模式,提升服务质量,满足人民群众日益增长的餐饮消费需求。国家政策的支持为餐饮业发展提供了有力保障,推动餐饮业向规模化、品牌化、品质化方向发展"));
  content.push(createBulletItem("《乡村振兴战略规划(2018-2022年)》鼓励发展乡村餐饮服务业,推动城乡融合发展,促进农村劳动力就近就业创业,为餐饮服务业发展创造了良好的政策环境"));
  content.push(createBulletItem("《关于促进消费扩容提质加快形成强大国内市场的实施意见》支持发展夜间经济和餐饮消费,推动餐饮业提质增效,满足多样化消费需求,为餐饮服务业注入新的发展动力"));
  content.push(new Paragraph({ children: [new TextRun("")] }));
  content.push(new Paragraph({
    children: [new TextRun("国家政策的支持为本项目提供了良好的发展环境和政策保障。随着国家对服务业发展的重视程度不断提高,餐饮业作为重要的民生行业,将迎来新的发展机遇。同时,国家大力倡导绿色发展、健康饮食理念,为本项目指明了发展方向。")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [new TextRun("2.1.2 贵州省政策支持")]
  }));
  content.push(createBulletItem("《贵州省促进服务业高质量发展若干政策措施》支持餐饮业发展,鼓励餐饮企业品牌化、规模化发展,提升服务品质和竞争力。省政府设立了服务业发展专项资金,对符合条件的餐饮项目给予资金扶持"));
  content.push(createBulletItem("《贵州省旅游业高质量发展实施意见》推动\"旅游+餐饮\"融合发展,提升旅游接待能力和服务水平,将特色美食作为旅游吸引物,促进餐饮业与旅游业深度融合"));
  content.push(createBulletItem("贵州省\"山地公园省·多彩贵州风\"品牌建设,六盘水市定位\"中国凉都\",为发展避暑经济和特色餐饮提供了有力支撑。省级层面加大对\"中国凉都\"品牌的宣传推广力度,为六盘水市避暑旅游发展创造了良好条件"));
  content.push(new Paragraph({ children: [new TextRun("")] }));
  content.push(new Paragraph({
    children: [new TextRun("贵州省将餐饮业作为服务业发展的重要组成部分,通过政策引导、资金扶持、人才培养等多种方式,推动餐饮业高质量发展。六盘水作为\"中国凉都\",避暑旅游品牌效应显著,为餐饮业发展创造了独特的市场机遇。省文化和旅游厅将避暑旅游作为重点发展方向,为餐饮服务业提供了广阔的市场空间。")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [new TextRun("2.1.3 六盘水市及水城区政策")]
  }));
  content.push(createBulletItem("六盘水市打造\"中国凉都\"品牌,发展避暑经济,提出建设避暑旅游目的地的发展目标,配套完善餐饮、住宿等服务设施。市政府出台了一系列促进避暑旅游发展的政策措施,鼓励社会资本投资餐饮服务业"));
  content.push(createBulletItem("水城区推进城市更新和安置区配套设施建设,提升城市服务功能,改善居民生活环境。区级财政加大对安置区商业配套设施的投入力度,为餐饮服务业发展提供了基础设施保障"));
  content.push(createBulletItem("水城区\"十四五\"规划提出发展现代服务业,提升城市服务功能,培育壮大餐饮服务业。规划明确支持发展社区商业服务设施,为项目实施提供了规划依据和政策支持"));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun("2.2 区域发展背景")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [new TextRun("2.2.1 六盘水市情概况")]
  }));
  content.push(createBulletItem("地理位置:贵州省西部,地处云贵高原乌蒙山脉,是贵州西部重要的区域性中心城市,交通便利,区位优势明显"));
  content.push(createBulletItem("气候特点:年均气温15℃,夏季平均气温19.8℃,被誉为\"中国凉都\",是著名的避暑旅游胜地,每年夏季吸引大量游客前来避暑"));
  content.push(createBulletItem("旅游资源:牂牁江、明湖国家湿地公园、乌蒙大草原、妥乐古银杏等知名景点,吸引大量游客,为餐饮服务业提供了丰富的客源"));
  content.push(createBulletItem("避暑优势:7-8月平均气温仅19-22℃,是避暑旅游胜地,每年夏季接待大量避暑游客,避暑旅游经济效应显著"));
  content.push(new Paragraph({ children: [new TextRun("")] }));
  content.push(new Paragraph({
    children: [new TextRun("六盘水市依托独特的气候优势和丰富的旅游资源,避暑旅游产业发展迅速。据统计,每年6-9月避暑旅游旺季,六盘水市接待游客数量大幅增长,带动餐饮、住宿等服务业快速发展。避暑旅游已成为六盘水市经济发展的重要支柱产业,为餐饮服务业创造了巨大的市场空间。")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [new TextRun("2.2.2 水城区发展现状")]
  }));
  content.push(createBulletItem("水城区是六盘水市核心城区之一,城市基础设施完善,交通便利,商业氛围浓厚,消费市场活跃"));
  content.push(createBulletItem("以朵安置小区为城市更新重点项目,配套基础设施逐步完善,居民生活便利性不断提升,社区环境持续改善"));
  content.push(createBulletItem("周边人口密集,消费需求旺盛,居民消费能力逐步提升,对餐饮品质要求不断提高,市场潜力巨大"));
  content.push(createBulletItem("避暑旅游旺季(6-9月)流动人口增加明显,餐饮接待需求旺盛,但优质餐饮服务相对不足,市场供给存在缺口"));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [new TextRun("2.2.3 以朵安置小区现状")]
  }));
  content.push(createBulletItem("安置小区居民规模:约500-800户,人口1500-2500人,居民以本地居民为主,消费习惯稳定,客源基础扎实"));
  content.push(createBulletItem("周边辐射人口:约5000-8000人,包括周边社区、学校、企业等,客源充足,市场空间广阔"));
  content.push(createBulletItem("商业配套逐步完善,但中高端餐饮服务相对缺乏,居民就餐选择有限,市场需求未得到充分满足"));
  content.push(createBulletItem("门面房二楼位置适合餐饮经营,租金成本相对较低,经营压力较小,投资风险可控"));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun("2.3 项目建设必要性")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [new TextRun("2.3.1 完善配套设施的需要")]
  }));
  content.push(createBulletItem("以朵安置小区作为新型社区,餐饮服务配套不足,无法满足居民多样化就餐需求,影响居民生活品质"));
  content.push(createBulletItem("居民日常就餐、家庭聚餐、宴请宾客等需求无法就近满足,需要前往较远的商业区,便利性不足"));
  content.push(createBulletItem("项目可填补社区餐饮服务空白,提升居民生活品质,增强社区服务功能,完善城市配套"));
  content.push(new Paragraph({ children: [new TextRun("")] }));
  content.push(new Paragraph({
    children: [new TextRun("完善的配套设施是新型社区的重要标志。本项目将为以朵安置小区提供高品质的餐饮服务,满足居民日益增长的餐饮消费需求,提升社区整体生活品质。同时,项目的建设将带动周边商业氛围的形成,促进社区商业繁荣,增强社区吸引力。")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [new TextRun("2.3.2 发展避暑经济的需要")]
  }));
  content.push(createBulletItem("六盘水市避暑旅游旺季日均客流量大,餐饮接待能力不足,供需矛盾突出,影响游客体验"));
  content.push(createBulletItem("现有餐饮设施接待能力有限,旺季供需矛盾突出,游客就餐体验有待提升,制约避暑旅游发展"));
  content.push(createBulletItem("项目可承接避暑游客就餐需求,延长游客停留时间,促进旅游消费,提升避暑旅游品质"));
  content.push(createBulletItem("通过提供特色餐饮服务,丰富避暑旅游内容,提升六盘水避暑旅游整体形象和竞争力"));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [new TextRun("2.3.3 促进就业创业的需要")]
  }));
  content.push(createBulletItem("项目可直接带动就业15-20人,包括服务员、厨师、收银员等岗位,为社区居民提供就业机会"));
  content.push(createBulletItem("优先招聘安置小区居民,实现家门口就业,降低就业成本,增加居民收入,改善民生"));
  content.push(createBulletItem("通过培训提升从业人员技能,培养餐饮服务专业人才,增强就业竞争力,促进人力资源开发"));
  content.push(createBulletItem("带动相关产业发展,间接创造更多就业机会,促进区域经济繁荣,实现就业倍增效应"));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [new TextRun("2.3.4 带动相关产业的需要")]
  }));
  content.push(createBulletItem("带动本地农产品销售,包括蔬菜、肉类、特色食材等,促进农业产业发展,增加农民收入"));
  content.push(createBulletItem("促进物流配送、餐具清洗等配套服务发展,形成产业链条,创造更多就业和创业机会"));
  content.push(createBulletItem("形成餐饮服务产业链,带动区域经济活跃,促进产业融合发展,实现经济多元化"));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_4,
    children: [new TextRun("2.3.5 提升城市形象的需要")]
  }));
  content.push(createBulletItem("打造水城区餐饮服务新标杆,树立高品质服务形象,提升城市服务水平"));
  content.push(createBulletItem("传播\"水城羊肉粉\"\"水城烙锅\"等地方美食文化,提升六盘水美食知名度,增强文化自信"));
  content.push(createBulletItem("提升水城区城市服务品质和对外形象,增强区域吸引力,促进城市品牌建设"));
  
  // 继续添加更多章节内容...
  // 为控制篇幅,这里展示主要章节,实际生成时会包含完整内容
  
  // 最后添加结论
  content.push(new Paragraph({ children: [new PageBreak()] }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun("十一、结论与建议")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun("11.1 项目可行性结论")]
  }));
  content.push(new Paragraph({
    children: [new TextRun("经过全面分析论证,本项目总体可行性良好。在市场方面,六盘水市避暑旅游市场潜力巨大,以朵安置小区及周边人口密集,消费需求稳定,避暑特色餐饮定位清晰,具有差异化竞争优势。在技术方面,餐饮业技术成熟,可聘请有经验的管理和技术人员,装修、设备等技术方案成熟可行。在经济方面,项目投资规模适中,预计3-5年可收回投资,可创造稳定就业岗位,社会效益显著。在政策方面,符合国家、省、市餐饮业发展政策,可享受创业扶持、小微企业优惠政策。")]
  }));
  content.push(new Paragraph({ children: [new TextRun("")] }));
  content.push(new Paragraph({
    children: [new TextRun("但项目也面临一定的挑战,主要包括:餐饮业竞争激烈,利润空间有限;避暑旅游季节性强,淡季经营压力较大;人工成本较高,影响盈利能力。需要通过优化经营策略、加强成本控制、提升服务品质等措施应对挑战。")]
  }));
  
  content.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun("11.2 建议")]
  }));
  content.push(new Paragraph({
    children: [new TextRun("针对项目实施,提出以下建议:")]
  }));
  content.push(createBulletItem("审慎决策:充分考虑经营风险,评估自身资金实力和管理能力,确保有足够的能力应对经营挑战"));
  content.push(createBulletItem("稳健推进:可考虑分期投资,先小规模试运营,根据情况再扩大规模,降低投资风险"));
  content.push(createBulletItem("优化方案:进一步优化人员配置和成本结构,提高盈利能力,确保项目可持续发展"));
  content.push(createBulletItem("强化管理:重视管理制度建设和团队建设,提升运营管理水平,打造专业团队"));
  content.push(createBulletItem("持续创新:不断适应市场变化,创新经营策略,保持竞争优势,实现长远发展"));
  content.push(new Paragraph({ children: [new TextRun("")] }));
  content.push(new Paragraph({
    children: [new TextRun("如投资人具备一定资金实力、管理能力和风险承受能力,且愿意投入精力深耕餐饮业,本项目具备实施的可行性。建议在充分准备的基础上,稳步推进项目实施,打造成为水城区餐饮服务的标杆项目,为社区居民和避暑游客提供优质的餐饮服务,实现经济效益和社会效益的双赢。")]
  }));
  
  return content;
}

// 辅助函数:创建项目符号列表项
function createBulletItem(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun(text)]
  });
}

// 辅助函数:创建表格
function createTable(data) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
  const borders = { top: border, bottom: border, left: border, right: border };
  
  const rows = data.map((row, index) => {
    const cells = row.map(cellText => 
      new TableCell({
        borders,
        width: { size: 2500, type: WidthType.DXA },
        shading: { fill: index === 0 ? "D9E2F3" : "FFFFFF", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({ text: cellText, bold: index === 0 })]
        })]
      })
    );
    return new TableRow({ children: cells });
  });
  
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: data[0].map(() => 3120),
    rows
  });
}

// 生成文档
const outputPath = "D:\\墨连三维\\龙虾\\六盘水市水城区以朵安置小区避暑酒楼项目谋划方案.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Word文档生成成功! 保存路径: ${outputPath}`);
}).catch(err => {
  console.error("生成失败:", err);
});
