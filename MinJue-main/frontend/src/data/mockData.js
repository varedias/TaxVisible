// Mock Data for Search Functionality

// Products Data (from Mall.jsx)
export const products = [
  {
    id: 1,
    name: '民崛智能模具视觉监测装置 MJ-VIS-A8',
    nameEn: 'Minjue Smart Mold Vision Monitoring System MJ-VIS-A8',
    price: 35800,
    image: '/products/minjue-product-1.png',
    parameterImage: '/products/1-parameter.jpg',
    category: 'ai-vision',
    rating: 4.9,
    sales: 856,
    supplier: '民崛智能科技有限公司',
    supplierEn: 'Minjue Intelligent Technology Co., Ltd',
    tags: ['模具监测', '视觉检测', '智能识别'],
    description: '专业模具视觉监测系统，实时监控模具状态，AI智能识别异常，适用于注塑、压铸等行业',
    specs: ['高清工业相机', '智能算法', '实时监控', '异常报警'],
    features: [
      '✓ 实时监控模具运行状态',
      '✓ AI智能识别模具异常',
      '✓ 自动报警提示',
      '✓ 数据统计分析',
      '✓ 远程查看功能'
    ]
  },
  {
    id: 2,
    name: '民崛智能模具保护监视器 MJ-MP-PRO',
    nameEn: 'Minjue Mold Protection Monitor MJ-MP-PRO',
    price: 28900,
    image: '/products/minjue-product-2.png',
    parameterImage: '/products/2-parameter.jpg',
    category: 'ai-vision',
    rating: 4.9,
    sales: 1023,
    supplier: '民崛智能科技有限公司',
    supplierEn: 'Minjue Intelligent Technology Co., Ltd',
    tags: ['模具保护', '实时监控', '高性价比'],
    description: '实时监控模具运行状态，自动检测异常，防止模具损坏，降低生产成本',
    specs: ['模具保护', '实时检测', '自动报警', '数据记录'],
    features: [
      '✓ 防止模具损坏',
      '✓ 自动检测异常情况',
      '✓ 快速响应报警',
      '✓ 延长模具使用寿命',
      '✓ 降低维护成本'
    ]
  },
  {
    id: 3,
    name: '民崛智能缺陷检测系统 MJ-QC-3000',
    nameEn: 'Minjue Defect Detection System MJ-QC-3000',
    price: 42000,
    image: '/products/minjue-product-3.png',
    parameterImage: '/products/3-parameter.jpg',
    category: 'ai-vision',
    rating: 4.8,
    sales: 645,
    supplier: '民崛智能科技有限公司',
    supplierEn: 'Minjue Intelligent Technology Co., Ltd',
    tags: ['缺陷检测', 'AI算法', '高精度'],
    description: '采用深度学习算法，精准识别产品表面缺陷，检测精度高达99.5%',
    specs: ['深度学习', '高精度检测', '多种缺陷识别', '自动分类'],
    features: [
      '✓ 99.5%检测精度',
      '✓ 识别多种缺陷类型',
      '✓ 自动分类统计',
      '✓ 深度学习算法',
      '✓ 可定制化训练'
    ]
  },
  {
    id: 4,
    name: '牧河自动化上料机 MH-FL-200',
    nameEn: 'Muhe Automation Feeder MH-FL-200',
    price: 18900,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
    category: 'automation',
    rating: 4.8,
    sales: 1234,
    supplier: '牧河自动化设备有限公司',
    supplierEn: 'Muhe Automation Equipment Co., Ltd',
    tags: ['自动上料', '高效稳定', '包邮'],
    description: '全自动上料系统，适用于各类生产线，提升生产效率'
  },
  {
    id: 5,
    name: '海康威视AI视觉检测系统 VIS-2000',
    nameEn: 'Hikvision AI Vision Inspection System VIS-2000',
    price: 28900,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    category: 'ai-vision',
    rating: 4.9,
    sales: 1245,
    supplier: '深圳智视科技有限公司',
    supplierEn: 'Shenzhen Smart Vision Tech',
    tags: ['AI检测', '高精度', '包邮'],
    description: '2D+3D双模式, 深度学习算法, 0.1mm精度'
  },
  {
    id: 8,
    name: 'Basler ace系列工业相机套装',
    nameEn: 'Basler ace Series Industrial Camera Kit',
    price: 4299,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    category: 'camera',
    rating: 4.8,
    sales: 2234,
    supplier: '杭州精准视觉设备厂',
    supplierEn: 'Hangzhou Precision Vision Factory',
    tags: ['高性价比', '现货', '包邮'],
    description: '200万像素, GigE接口, 含镜头'
  },
  {
    id: 9,
    name: 'CCS LED环形光源 LDR2-100',
    nameEn: 'CCS LED Ring Light LDR2-100',
    price: 680,
    image: 'https://images.unsplash.com/photo-1581093458791-9d58b3fbbd0d?w=400',
    category: 'lens',
    rating: 4.8,
    sales: 5678,
    supplier: '上海光源智能装备',
    supplierEn: 'Shanghai Light Source Intelligent',
    tags: ['畅销', '质保3年', '包邮'],
    description: '高亮度, 可调光, 多种规格'
  },
  {
    id: 10,
    name: '基恩士3D激光轮廓仪',
    nameEn: 'Keyence 3D Laser Profiler',
    price: 15800,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
    category: 'measure',
    rating: 4.7,
    sales: 567,
    supplier: '北京博视自动化',
    supplierEn: 'Beijing BoShi Automation',
    tags: ['微米级精度', '抗干扰'],
    description: '超高精度3D测量, 适用于各种材质'
  },
  {
    id: 5,
    name: 'ABB工业机器人IRB 1200',
    nameEn: 'ABB Industrial Robot IRB 1200',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    category: 'robot',
    rating: 4.9,
    sales: 345,
    supplier: '广州机器人技术中心',
    supplierEn: 'Guangzhou Robotics Center',
    tags: ['高速', '紧凑型'],
    description: '5kg/7kg负载, 适用于装配和物料搬运'
  },
  {
    id: 6,
    name: '远心镜头 50mm',
    nameEn: 'Telecentric Lens 50mm',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
    category: 'lens',
    rating: 4.6,
    sales: 890,
    supplier: '苏州光学仪器厂',
    supplierEn: 'Suzhou Optical Instruments',
    tags: ['低畸变', '高分辨率'],
    description: '支持2/3英寸靶面, C接口'
  }
];

// Discovery Content Data (from Discovery.jsx)
export const discoveryContent = [
  {
    id: 1,
    title: '海康威视AI视觉检测系统深度测评',
    titleEn: 'Hikvision AI Vision Inspection System In-depth Review',
    type: 'video',
    cover: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
    author: '工业视觉达人',
    views: 125600,
    category: 'review',
    tags: ['AI检测', '海康威视', '测评']
  },
  {
    id: 2,
    title: '基恩士vs康耐视 | 3D视觉传感器横评',
    titleEn: 'Keyence vs Cognex | 3D Vision Sensor Comparison',
    type: 'video',
    cover: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600',
    author: '智能制造观察',
    views: 89200,
    category: 'review',
    tags: ['基恩士', '康耐视', '3D视觉']
  },
  {
    id: 3,
    title: '如何选择工业相机？5个关键参数详解',
    titleEn: 'How to Choose Industrial Cameras? 5 Key Parameters',
    type: 'article',
    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
    author: '机器视觉专家',
    views: 8500,
    category: 'tutorial',
    tags: ['工业相机', '选购指南']
  },
  {
    id: 4,
    title: '探厂实拍 | 走进深圳AI视觉检测设备制造商',
    titleEn: 'Factory Tour | Inside Shenzhen AI Vision Equipment Manufacturer',
    type: 'vlog',
    cover: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
    author: '工业探厂Vlog',
    views: 234000,
    category: 'vlog',
    tags: ['探厂', '深圳', '制造业']
  }
];

// Suppliers Data
export const suppliers = [
  { 
    id: 1, 
    name: '民崛智能科技有限公司', 
    nameEn: 'Minjue Intelligent Technology Co., Ltd',
    mainProducts: '模具视觉监测装置、智能检测系统', 
    mainProductsEn: 'Mold Vision Monitoring, Smart Inspection Systems',
    years: 10, 
    certifications: ['ISO9001', '高新技术企业', 'CE认证'], 
    certificationsEn: ['ISO9001', 'High-Tech Enterprise', 'CE'],
    rating: 4.9, 
    orders: 856, 
    logo: 'https://ui-avatars.com/api/?name=MJ&background=6366F1&color=fff',
    description: '专注于模具行业智能化解决方案，提供模具视觉监测、缺陷检测等智能装备。拥有完整的研发、生产、售后体系。',
    descriptionEn: 'Focus on intelligent solutions for mold industry, providing mold vision monitoring, defect detection equipment. Complete R&D, production and after-sales system.',
    website: 'https://min-jue.com/',
    location: '浙江省宁波市',
    founded: '2014年',
    employees: '50-100人',
    type: '有限责任公司',
    registered: '1000万元',
    responseRate: 99,
    responseTime: '1小时内',
    contact: {
      phone: '400-xxx-xxxx',
      email: 'info@min-jue.com',
      address: '浙江省宁波市'
    },
    detailDescription: '民崛智能科技有限公司是一家专业从事模具智能化监测设备研发、生产和销售的高新技术企业。公司成立于2014年，总部位于浙江省宁波市。\n\n公司主营产品包括模具视觉监测装置、智能缺陷检测系统、模具保护监视器等。产品广泛应用于注塑、压铸、冲压等模具行业，帮助企业实现生产过程的智能化监控，提高生产效率，降低不良率。\n\n民崛智能拥有完整的研发、生产、销售和售后服务体系，产品已获得多项国家专利，通过了ISO9001质量管理体系认证和CE认证。公司始终坚持以客户需求为导向，为客户提供优质的产品和专业的技术服务。'
  },
  { 
    id: 2, 
    name: '牧河自动化设备有限公司', 
    nameEn: 'Muhe Automation Equipment Co., Ltd',
    mainProducts: '自动上料机、输送系统', 
    mainProductsEn: 'Auto Feeders, Conveyor Systems',
    years: 8, 
    certifications: ['ISO9001', 'CE认证', '安全生产认证'], 
    certificationsEn: ['ISO9001', 'CE', 'Safety Cert'],
    rating: 4.8, 
    orders: 1234, 
    logo: 'https://ui-avatars.com/api/?name=MH&background=10B981&color=fff',
    description: '专业自动化上料设备制造商，产品广泛应用于电子、塑料、五金等行业。提供定制化自动化解决方案。',
    descriptionEn: 'Professional automation feeder manufacturer, products widely used in electronics, plastics, hardware industries. Providing customized automation solutions.',
    location: '江苏省苏州市',
    founded: '2016年',
    employees: '30-50人',
    type: '有限责任公司',
    registered: '500万元',
    responseRate: 97,
    responseTime: '2小时内',
    contact: {
      phone: '400-xxx-xxxx',
      email: 'contact@muhe-auto.com',
      address: '江苏省苏州市工业园区'
    },
    detailDescription: '牧河自动化设备有限公司专注于为制造企业提供自动化上料解决方案。公司产品包括震动盘、直振送料器、螺旋上料机等多种自动上料设备，适用于电子、塑料、五金、食品等多个行业。\n\n公司拥有专业的技术团队和完善的售后服务体系，可根据客户需求提供定制化解决方案。产品以高稳定性、高效率著称，深受客户信赖。'
  },
  { 
    id: 3, 
    name: '深圳智视科技有限公司', 
    nameEn: 'Shenzhen Smart Vision Tech',
    mainProducts: 'AI视觉检测系统', 
    mainProductsEn: 'AI Vision Systems',
    years: 8, 
    certifications: ['ISO9001', '高新技术企业'], 
    certificationsEn: ['ISO9001', 'High-Tech Enterprise'],
    rating: 4.9, 
    orders: 1234, 
    logo: 'https://ui-avatars.com/api/?name=ZS&background=0D8ABC&color=fff',
    description: '专注于工业AI视觉检测解决方案，拥有自主研发的深度学习算法平台。',
    descriptionEn: 'Focusing on industrial AI vision inspection solutions with self-developed deep learning algorithm platform.',
    location: '广东省深圳市南山区',
    founded: '2016年',
    employees: '200-500人',
    type: '有限责任公司',
    registered: '5000万元',
    responseRate: 98,
    responseTime: '2小时内',
    contact: {
      phone: '400-888-8888',
      email: 'contact@zhishi-tech.com',
      address: '深圳市南山区科技园南区深圳湾科技生态园10栋A座8楼'
    },
    detailDescription: '深圳智视科技有限公司成立于2016年,是一家专注于工业视觉检测系统研发、生产和销售的高新技术企业。公司拥有强大的研发团队和完善的售后服务体系,产品广泛应用于电子、汽车、医疗等行业。'
  },
  { 
    id: 4, 
    name: '杭州精准视觉设备厂', 
    nameEn: 'Hangzhou Precision Vision Factory',
    mainProducts: '工业相机及镜头', 
    mainProductsEn: 'Industrial Cameras & Lenses',
    years: 12, 
    certifications: ['CE认证', 'ISO14001'], 
    certificationsEn: ['CE', 'ISO14001'],
    rating: 4.8, 
    orders: 2156, 
    logo: 'https://ui-avatars.com/api/?name=JZ&background=22C55E&color=fff',
    description: '国内领先的工业相机制造商，产品广泛应用于电子、汽车、医药等行业。',
    descriptionEn: 'Leading domestic industrial camera manufacturer, products widely used in electronics, automotive, pharmaceutical industries.',
    location: '浙江省杭州市',
    founded: '2012年',
    employees: '100-200人',
    type: '有限责任公司',
    registered: '2000万元',
    responseRate: 96,
    responseTime: '3小时内',
    contact: {
      phone: '400-xxx-xxxx',
      email: 'sales@jzvision.com',
      address: '杭州市滨江区'
    },
    detailDescription: '杭州精准视觉设备厂是国内领先的工业相机制造商，产品广泛应用于电子、汽车、医药等行业。拥有完整的产品线和专业的技术支持团队。'
  },
  { 
    id: 5, 
    name: '上海光源智能装备', 
    nameEn: 'Shanghai Light Source Intelligent',
    mainProducts: '机器视觉光源', 
    mainProductsEn: 'Machine Vision Lighting',
    years: 6, 
    certifications: ['3C认证', '专利20+'], 
    certificationsEn: ['3C', 'Patents 20+'],
    rating: 4.7, 
    orders: 987, 
    logo: 'https://ui-avatars.com/api/?name=GY&background=F59E0B&color=fff',
    description: '专业研发生产机器视觉LED光源，提供定制化光源解决方案。',
    descriptionEn: 'Professional R&D and production of machine vision LED lighting, providing customized lighting solutions.',
    location: '上海市浦东新区',
    founded: '2018年',
    employees: '30-50人',
    type: '有限责任公司',
    registered: '800万元',
    responseRate: 95,
    responseTime: '4小时内',
    contact: {
      phone: '400-xxx-xxxx',
      email: 'info@gylight.com',
      address: '上海市浦东新区'
    },
    detailDescription: '上海光源智能装备专业研发生产机器视觉LED光源，提供定制化光源解决方案。产品质量稳定，性能优异。'
  },
  { 
    id: 6, 
    name: '北京博视自动化技术', 
    nameEn: 'Beijing BoShi Automation',
    mainProducts: '自动化检测方案', 
    mainProductsEn: 'Automation Solutions',
    years: 15, 
    certifications: ['ISO9001', '军工资质'], 
    certificationsEn: ['ISO9001', 'Military Qual'],
    rating: 5.0, 
    orders: 3456, 
    logo: 'https://ui-avatars.com/api/?name=BS&background=EF4444&color=fff',
    description: '资深自动化系统集成商，服务于航空航天、军工等高端制造领域。',
    descriptionEn: 'Senior automation system integrator, serving aerospace, military and other high-end manufacturing fields.',
    location: '北京市海淀区',
    founded: '2009年',
    employees: '500+人',
    type: '有限责任公司',
    registered: '10000万元',
    responseRate: 99,
    responseTime: '1小时内',
    contact: {
      phone: '400-xxx-xxxx',
      email: 'service@boshi-auto.com',
      address: '北京市海淀区中关村'
    },
    detailDescription: '北京博视自动化技术是资深自动化系统集成商，服务于航空航天、军工等高端制造领域。拥有丰富的项目经验和专业的技术团队。'
  },
];

// Procurements Data
export const procurements = [
  { 
    id: 1, 
    title: '采购模具视觉监测装置5套用于注塑生产线', 
    titleEn: 'Procuring 5 sets of Mold Vision Monitoring for Injection Line',
    quantity: '5套', 
    quantityEn: '5 Sets',
    budget: '20-25万', 
    budgetEn: '200k-250k',
    deadline: '10天', 
    deadlineEn: '10 Days',
    location: '浙江宁波', 
    locationEn: 'Ningbo, ZJ',
    time: '1小时前',
    timeEn: '1h ago',
    description: '需要采购模具视觉监测系统，用于注塑模具实时监控，要求能够识别模具表面缺陷、磨损情况，支持AI智能分析。',
    descriptionEn: 'Need mold vision monitoring systems for injection mold real-time monitoring, capable of identifying surface defects and wear, supporting AI analysis.'
  },
  { 
    id: 2, 
    title: '求购自动上料机8台配套生产线改造', 
    titleEn: 'Buying 8 Auto Feeders for Production Line Upgrade',
    quantity: '8台', 
    quantityEn: '8 Units',
    budget: '12-15万', 
    budgetEn: '120k-150k',
    deadline: '15天', 
    deadlineEn: '15 Days',
    location: '江苏苏州', 
    locationEn: 'Suzhou, JS',
    time: '3小时前',
    timeEn: '3h ago',
    description: '工厂升级改造需要，采购全自动上料机，要求稳定性高，能够适配现有生产线，支持多种物料规格。',
    descriptionEn: 'Factory upgrade needed, procuring fully automatic feeders, high stability required, compatible with existing lines, supporting various material specs.'
  },
  { 
    id: 3, 
    title: '求购10台2D视觉检测设备用于手机屏幕检测', 
    titleEn: 'Buying 10 units of 2D Vision Inspection for Phone Screens',
    quantity: '10台', 
    quantityEn: '10 Units',
    budget: '15-20万', 
    budgetEn: '150k-200k',
    deadline: '7天', 
    deadlineEn: '7 Days',
    location: '广东深圳', 
    locationEn: 'Shenzhen, GD',
    time: '2小时前',
    timeEn: '2h ago',
    description: '急需采购一批用于手机屏幕表面划痕、坏点检测的2D视觉设备。要求检测精度0.01mm，检测速度<1s/pcs。',
    descriptionEn: 'Urgently need to purchase a batch of 2D vision equipment for phone screen surface scratch and dead pixel detection. Requirement: accuracy 0.01mm, speed <1s/pcs.'
  },
  { 
    id: 4, 
    title: '采购工业相机500万像素GigE接口50套', 
    titleEn: 'Procuring 50 sets of 5MP GigE Industrial Cameras',
    quantity: '50套', 
    quantityEn: '50 Sets',
    budget: '面议', 
    budgetEn: 'Negotiable',
    deadline: '15天', 
    deadlineEn: '15 Days',
    location: '江苏苏州', 
    locationEn: 'Suzhou, JS',
    time: '5小时前',
    timeEn: '5h ago',
    description: '寻找长期合作供应商，采购500万像素全局快门工业相机，GigE接口，兼容Halcon。',
    descriptionEn: 'Looking for long-term suppliers for 5MP global shutter industrial cameras, GigE interface, compatible with Halcon.'
  },
  { 
    id: 3, 
    title: '寻3D激光扫描系统用于汽车零件检测', 
    titleEn: 'Seeking 3D Laser Scanning System for Auto Parts',
    quantity: '3套', 
    quantityEn: '3 Sets',
    budget: '80-100万', 
    budgetEn: '800k-1M',
    deadline: '30天', 
    deadlineEn: '30 Days',
    location: '上海', 
    locationEn: 'Shanghai',
    time: '1天前',
    timeEn: '1d ago',
    description: '汽车零部件工厂，需要3D激光扫描系统检测铸件尺寸偏差。',
    descriptionEn: 'Auto parts factory needs 3D laser scanning system to detect casting dimension deviations.'
  },
  { 
    id: 4, 
    title: '长期采购LED环形光源各种规格', 
    titleEn: 'Long-term Purchase of LED Ring Lights (Various Specs)',
    quantity: '长期', 
    quantityEn: 'Long-term',
    budget: '按批次', 
    budgetEn: 'Per Batch',
    deadline: '长期有效', 
    deadlineEn: 'Ongoing',
    location: '浙江杭州', 
    locationEn: 'Hangzhou, ZJ',
    time: '2天前',
    timeEn: '2d ago',
    description: '视觉集成商，长期采购各种规格LED环形光源，要求稳定性好，性价比高。',
    descriptionEn: 'Vision integrator, long-term purchase of various specs LED ring lights, requiring good stability and high cost-performance.'
  },
  { 
    id: 5, 
    title: '求购OCR字符识别系统及配套软件', 
    titleEn: 'Buying OCR System & Software',
    quantity: '5套', 
    quantityEn: '5 Sets',
    budget: '10-15万', 
    budgetEn: '100k-150k',
    deadline: '10天', 
    deadlineEn: '10 Days',
    location: '湖北武汉', 
    locationEn: 'Wuhan, HB',
    time: '3天前',
    timeEn: '3d ago',
    description: '物流分拣线需要OCR系统识别包裹面单信息，支持高速动态识别。',
    descriptionEn: 'Logistics sorting line needs OCR system to recognize package label info, supporting high-speed dynamic recognition.'
  },
  { 
    id: 6, 
    title: '采购表面缺陷检测系统用于钢板生产线', 
    titleEn: 'Procuring Surface Defect Detection for Steel Line',
    quantity: '2套', 
    quantityEn: '2 Sets',
    budget: '面议', 
    budgetEn: 'Negotiable',
    deadline: '20天', 
    deadlineEn: '20 Days',
    location: '河北唐山', 
    locationEn: 'Tangshan, HB',
    time: '4天前',
    timeEn: '4d ago',
    description: '钢厂冷轧线，需要在线检测钢板表面缺陷（划痕、凹坑、锈斑等）。',
    descriptionEn: 'Steel mill cold rolling line, needs online detection of steel plate surface defects (scratches, pits, rust spots, etc.).'
  },
];

// Search Function
export const searchData = (query, lang = 'zh') => {
  if (!query) return { products: [], content: [] };
  
  const lowerQuery = query.toLowerCase();
  
  const filteredProducts = products.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(lowerQuery);
    const nameEnMatch = item.nameEn.toLowerCase().includes(lowerQuery);
    const descMatch = item.description.toLowerCase().includes(lowerQuery);
    const supplierMatch = item.supplier.toLowerCase().includes(lowerQuery) || item.supplierEn.toLowerCase().includes(lowerQuery);
    const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
    
    return nameMatch || nameEnMatch || descMatch || supplierMatch || tagMatch;
  });

  const filteredContent = discoveryContent.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(lowerQuery);
    const titleEnMatch = item.titleEn.toLowerCase().includes(lowerQuery);
    const authorMatch = item.author.toLowerCase().includes(lowerQuery);
    const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
    
    return titleMatch || titleEnMatch || authorMatch || tagMatch;
  });

  return {
    products: filteredProducts,
    content: filteredContent
  };
};
