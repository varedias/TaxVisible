const DEFAULT_VIDEO_URL = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const DISCOVERY_SORTER_LIVE_VIDEO_URL = '/videos/discovery-sorter-live-demo.mp4';
const DISCOVERY_SORTER_STABILITY_VIDEO_URL = '/videos/discovery-sorter-stability-demo.mp4';
const ARTICLE_PAGE_SIZE = 3;

const paginateArticleSections = (sections, pageSize = ARTICLE_PAGE_SIZE) =>
  sections.reduce((pages, section, index) => {
    const pageIndex = Math.floor(index / pageSize);

    if (!pages[pageIndex]) {
      pages[pageIndex] = {
        id: `page-${pageIndex + 1}`,
        title: `第 ${pageIndex + 1} 页`,
        sections: [],
      };
    }

    pages[pageIndex].sections.push(section);
    return pages;
  }, []);

export const discoveryCategories = [
  { id: 'all', name: '全部', icon: '🎬' },
  { id: 'review', name: '设备测评', icon: '⭐' },
  { id: 'vlog', name: '实拍Vlog', icon: '📹' },
  { id: 'tutorial', name: '使用教程', icon: '📚' },
  { id: 'trading', name: '设备买卖', icon: '💰' },
  { id: 'analysis', name: '行业分析', icon: '📊' },
];

export const discoverySortOptions = [
  { id: 'hot', name: '综合排序' },
  { id: 'latest', name: '最新发布' },
  { id: 'popular', name: '最多播放' },
  { id: 'liked', name: '最多点赞' },
];

export const discoveryVideos = [
  {
    id: 25,
    title: '基于视觉的智能分拣机市场——全球预测2026-2032',
    cover: '/Picture/OIP-C.webp',
    thumbnail: '/Picture/OIP-C.webp',
    author: '民崛研究院',
    avatar: 'https://ui-avatars.com/api/?name=MJ&background=0F766E&color=fff',
    authorAvatar: 'https://ui-avatars.com/api/?name=MJ&background=0F766E&color=fff',
    views: 528000,
    likes: 16800,
    uploadTime: '今日精选',
    publishDate: '2026-04-07',
    category: 'analysis',
    tags: ['智能分拣', '市场预测', '采购策略'],
    comments: 326,
    type: 'article',
    readTime: '8分钟阅读',
    featured: true,
    summary: '基于视觉的智能分拣机市场从2025年的23.8亿美元增长到2026年的26.7亿美元。预计其复合年增长率将保持在13.20%,到2032年达到56.8亿美元。',
    description: '基于视觉的智能分拣机市场从2025年的23.8亿美元增长到2026年的26.7亿美元。预计其复合年增长率将保持在13.20%,到2032年达到56.8亿美元。',
    sections: [
      {
        title: '为何基于视觉的智能分拣机正成为质量、收益和弹性自动化战略的关键运营基础设施',
        paragraphs: [
          '基于视觉的智能分拣机位于自动化、质量保证和资源效率的交汇点。它们结合成像硬件、照明设计和人工智能驱动的分类,以工业速度识别、分级和传输路线,替代或增强人工检测以及传统的仅传感器分拣。随着劳动力市场收紧和质量标准不断提高,这些系统越来越被视为非可选附加组件,而是作为核心生产基础设施,通过提高产量、减少污染和更稳定的吞吐量来保护利润率。',
          '当前排序技术浪潮的独特之处在于从基于规则的刚性逻辑向自适应感知的转变。现代平台可以学习细致的视觉线索——表面缺陷、形状异常、颜色方差、标签不一致以及材料成分代理,然后通过空中喷气机、机器人拾取器、分流器或输送机路由来执行精确分离。这种能力在投入差异较大的溪流中尤为有价值,例如回收利用、食品加工和包裹物流,其中差异性是常态而非例外。',
          '与此同时,采用正受到工厂车间以外的限制。能源成本、可持续性要求以及不断演变的贸易政策会影响制造商的采购能力、部署速度以及哪些架构能够长期维持运行。因此,行政决策者要求采用更全面的视角,将技术绩效与全生命周期所有权、供应链韧性以及监管一致性联系起来。本执行摘要阐述了塑造基于视觉的智能分拣机格局的最具决策相关性的发展。',
        ],
      },
      {
        title: '人工智能感知、边缘计算以及以可持续发展为导向的采购如何重塑从设备采购到平台的智能排序',
        paragraphs: [
          '智能分拣的竞争格局经历了根本性转变,人工智能感知已从小众能力逐渐发展为基准预期。早期几代人专注于确定性阈值和狭窄的特征检测,通常需要大量手动调校来处理新产品或环境变化。如今,基于不同数据集训练的深度学习模型,能够在不断变化的照明、遮挡和表面复杂性方面实现更可靠的分类,缩短重新配置时间,并使多产品线更加可行。',
          '硬件创新正在重塑技术和经济可行性。分辨率更高的摄像机、更快的帧率和改进的光学器件正在扩大可检测缺陷类型,同时保持线路速度。多光谱和高光谱成像,曾经仅限于特定应用,正被设计成更实用的外形,能够检测在标准RGB中无法见到的材料差异。与此同时,边缘计算加速器正在为生产线带来高性能的推理能力,降低延迟和对云连接的依赖,同时改善数据治理。',
          '另一个重大转变是转向集成自动化生态系统,而非独立的分拣机。买家越来越期望与MES、SCADA和ERP环境实现无缝连接,以及在物流设置中与仓库执行系统的兼容性。因此,供应商通过支持可追溯性、审计跟踪、模型监控和远程诊断的软件层进行差异化处理。这种以软件为中心的差异化化因客户对可解释性和验证性的需求而加剧,尤其是在食品、药品和受监管的回收渠道中——在这些渠道中,合理排序决策的合理性可能与制定决策同样重要。',
          '最后,可持续性要求正在改变采购标准。现在不仅从纯度和产量方面,还从下游影响评估了分拣精度:减少垃圾填埋场,提高回收质量,减少洗涤过程中的用水量,减少食品生产中的弃批批次。随着组织制定可衡量的ESG目标,智能分拣正日益成为循环和废物最小化的杠杆,推动行业实现更高的精度、更优化的报告和可验证的结果。',
        ],
      },
      {
        title: '2025年美国关税如何重塑采购、生命周期服务重点以及用于分拣自动化的风险管理采购',
        paragraphs: [
          '2025年美国的关税主要通过采购时机、物料清单战略和供应商资质来影响智能分拣机市场。基于视觉的分拣系统依赖于全球分布式的组件——工业相机、镜头、照明模块、传感器、PLC、伺服驱动器、计算加速器和机械组件。当关税风险增加,或在交货时间带来不确定性时,买家会通过加快采购、重新谈判合同或使供应商多样化来稳定项目总成本。',
          '最直接的影响之一是重新关注本地化和“关税感知”设计。设备制造商正在重新审视采购策略,以减少对受关税影响的进口依赖,尤其是在计算和电子密集型子系统中。这正在加速关键部件的双源化,重新设计控制柜以支持替代组件系列,并在摄像头和照明模块中构建灵活性,以便在无需重新验证整个系统的情况下更换等效设备。随着时间的推移,这些工程选择可以提升韧性,但在短期内会增加资质、文档和售后服务的复杂性。',
          '关税还凸显了生命周期服务模式的重要性。当更换零件变得更昂贵或更难快速采购时,停机风险将成为高吞吐量设施的董事会关注点。这促使决策者转向拥有强大国内库存仓位、维修能力和远程支持基础设施的供应商。它还有助于提高人们对预测性维护和状态监测功能的兴趣,这些功能可以减少紧急故障,并帮助团队理性地规划备件。',
          '此外,以关税为导向的成本压力正在改变自动化投资回报率(ROI)的评估方式。买家不太愿意接受不透明的定价或专有的锁定功能,这可能会放大未来的成本冲击。相反,人们对模块化系统、开放式集成选项以及关于软件授权、模型更新和备件可用性的合同明确性有更强的偏好。实际上,关税不仅是一种成本变化,更是一种催化剂,促使采购更加严格,技术尽职调查更加深入,并转向能够承受政策波动的架构。',
        ],
      },
      {
        title: '关于用例契合、传感器和操作选择的细分揭示了哪些内容,以及软件治理为何会逐步定义其排序性能',
        paragraphs: [
          '细分显示,需求模式因所处理内容、决策执行方式以及系统在操作工作流程中的位置而存在显著差异。通过组件架构的视角观察时,买家会权衡相机和传感器的配置、照明设计以及计算位置,以匹配线速和缺陷复杂性。RGB 视觉技术在众多应用中仍是主力,但在材料歧视或污染检测至关重要的地方,多光谱配置正日益被选择。计算选择型推理与更集中处理的区别在于延迟承受能力、数据治理以及实时操作的需求。',
          '分拣机制和自动化水平之间的差异同样明显。喷气喷射和机械分流器继续主导高速散装流,而机器人采摘技术则在物品级操控和灵活路由比原始吞吐量更为重要的地方。频繁更换SKU的设施,可快速进行重新训练并以最短停机时间进行验证,从而提升软件优先系统的价值。相反,具有稳定输入功能的操作可能优先考虑坚固性、确定性性能以及较低的总维护开销。',
          '应用程序驱动的细分凸显了性能指标必须具有情境性的原因。在食品和农业中,缺陷检测、外来材料识别和轻柔处理是核心因素,且环保型机械设计通常不可转让。在回收和废物管理中,纯度目标和污染清除决定了经济性,使得传感器融合和持续模型的改进尤为有价值,因为输入流因季节和地点而异。在物流和包裹工作流程中,标签读取、尺寸和损坏检测将成像速度、照明一致性以及与下游路由逻辑的紧密集成放在首位。',
          '最终用户细分凸显了采购动态。大型企业通常在跨平台平台上实现标准化,这些平台可在管理一致性的不同范围内进行复制,促使供应商提供车队管理、远程监控和跨线分析服务。中小型企业通常优先考虑快速返现、直接集成和服务响应,从而更倾向于模块化部署和封装解决方案。在所有领域,软件功能——模型管理、可追溯性和监控——正变得越来越果断,不是作为可选功能,而是作为正常运行时间和合规性的保障。',
        ],
      },
      {
        title: '区域运营现实——从监管到劳动力和基础设施——如何塑造智能分拣的采用路径和绩效预期',
        paragraphs: [
          '区域动态由劳动力可及性、监管执法、基础设施成熟度以及已嵌入供应链中的工业自动化程度所决定。在北美,采用与人工替代、安全考虑以及正常运行时间驱动的运营密切相关,买家强调服务可用性、零部件可及性以及与既定控制环境的集成。该地区还通过改造友好的视觉模块和边缘计算设备,对升级传统线路表现出浓厚的兴趣,这些设备能够限制中断。',
        ],
      },
      {
        title: '实可行的领导措施,以降低智能分拣投资风险,加强数据治理,并构建可扩展的多站点自动化能力',
        paragraphs: [
          '行业领导者在投资基于愿景的智能分拣时,可以立即采取措施降低风险并改善效果。首先,通过定义与运营与财务保持一致的成功指标:污染阈值、产量改进、吞吐量稳定性以及停机耐受性应以直接与植物经济学挂钩的方式进行量化。从此,将这些目标转化为传感模式、计算延迟和动作精度的技术要求,确保演示能够反映实际的输入变异性,而非精心挑选的样本。',
          '接下来,将数据视为需要治理的资产。建立数据集质量、标签标准和变更控制的内部所有权,以确保模型更新不会成为临时实验。要求供应商提供清晰的工作流程,以实现验证、回滚和性能监控,并确保网络安全需求尽早得到满足,尤其是在涉及远程访问和云分析的情况下。这一学科降低了模型漂移的风险,并有助于在材料、包装或产品混合物变化时保持准确性。',
          '采购策略应明确考虑关税和供应链的波动。优先采用可容纳替代组件的模块化架构,并就备件的可用性、交货时间和软件许可问题进行合同清算。在可能的情况下,制定先从价值最密集的线路开始的分阶段部署计划,然后使用标准化配置和可重复使用的训练资源进行扩展。',
          '最后,投资变革管理和能力建设。当操作员和维护团队了解如何解读系统输出、管理清洁和校准流程,以及利用远程诊断来加重问题时,智能分拣效果会发挥最佳效果。将培训与轮班工作和人员流动的现实情况保持一致,并创建反馈循环,以便制作团队能够快速标记新的缺陷类型或污染模式。通过这些实践,组织可以从孤立的自动化胜利转变为可扩展的分拣策略,从而随时间推移增加价值。',
        ],
      },
      {
        title: '一种将初级行业参与与多源验证相结合的严谨方法,将技术能力与采购与部署现实相结合',
        paragraphs: [
          '本报告的研究方法将结构化的初级参与与严格的二次分析相结合,以涵盖技术现实和商业决策驱动因素。首先,围绕基于视觉的智能分拣系统定义产品范围,包括实现感知和驱动的硬件子系统,以及分类、监控和集成所需的软件功能。在主要工业环境中绘制了用例,以确保发现反映运营多样性,而非单一的终端市场视角。',
          '主要投入内容包括与整个价值链中的利益相关方进行访谈和结构化讨论,例如设备制造商、零部件供应商、系统集成商以及负责运营、质量和维护的最终用户。这些业务侧重于实际性能约束、集成挑战、采购标准、服务期望以及人工智能生命周期管理的作用。这些对话的洞察被综合起来,以识别反复出现的模式、分歧点以及新兴的最佳实践。',
          '二级研究评估监管方向、技术标准、专利和产品公告信号,以及影响分类采用的更广泛的工业自动化发展。会审查公司文件、技术简报和公开案例陈述,以了解供应商如何调整其能力,以及客户如何验证其价值。在整个过程中,信息会跨多个独立输入进行交叉核对,以减少偏差并提高可靠性。',
          '最后,该分析采用结构化框架,将技术变革与采购现实(包括供应链限制和关税风险敞口)联系起来。其理念是注重决策,强调运营契合度、生命周期风险和实施路径,使高管能够将这些发现作为供应商选择、部署规划和长期能力建设的实用指南。',
        ],
      },
      {
        title: '战略要点:目前,卓越排序依赖于持续的人工智能生命周期、具有韧性的采购能力以及安装之外的运营一致性',
        paragraphs: [
          '基于视觉的智能分拣机正在发展成为现代化操作的基础能力,这不仅因为它们能够自动执行任务,还因为它们能够稳定质量,并在可变环境中释放出新的一致性水平。市场方向正受到人工智能成熟度、改进的传感选择以及边缘计算架构的影响,这些架构使决策速度越来越接近。同时,客户要求在生产中支持这些系统至关重要性的可追溯性、验证性和软件生命周期支持。',
          '2025年贸易政策的不确定性和关税压力凸显了对具有韧性的采购和服务战略的需求。将分拣投资视为长期平台的组织,通过模块化设计、强大的供应商治理和主动维护提供支持,能够更好地抵御成本冲击和供应中断。',
          '最终,成功的部署将三个要素结合起来:明确的操作问题陈述、与现实世界变化相匹配的技术配置,以及在调试后维持性能的治理模型。连接这些点的高管可以在提高质量、减少浪费的同时,跨越工厂和流程进行智能化分拣,并增强在日益严苛的供应链中的竞争力。',
        ],
      },
    ],
  },
  {
    id: 24,
    title: '民崛智能分拣现场实拍：高速识别与自动分流演示',
    cover: '/videos/discovery-sorter-live-cover.jpg',
    author: '民崛智能',
    avatar: 'https://ui-avatars.com/api/?name=MJ&background=1D4ED8&color=fff',
    views: 486000,
    likes: 14200,
    duration: '01:31',
    uploadTime: '刚刚',
    publishDate: '2026-04-07',
    category: 'vlog',
    tags: ['智能分拣', '产线实拍', '自动分流'],
    comments: 618,
    rating: 5.0,
    type: 'video',
    featured: true,
    summary: '聚焦民崛智能现场分拣节拍、识别速度和自动分流动作，让客户在发现页先看到更直观的设备实拍效果。',
    videoUrl: DISCOVERY_SORTER_LIVE_VIDEO_URL,
  },
  {
    id: 23,
    title: '民崛智能方案纪实：复杂来料下的视觉分拣稳定性验证',
    cover: '/videos/discovery-sorter-stability-cover.jpg',
    author: '民崛智能',
    avatar: 'https://ui-avatars.com/api/?name=MJ&background=2563EB&color=fff',
    views: 428000,
    likes: 13100,
    duration: '00:31',
    uploadTime: '刚刚',
    publishDate: '2026-04-07',
    category: 'review',
    tags: ['复杂来料', '稳定性验证', '视觉分拣'],
    comments: 472,
    rating: 4.9,
    type: 'video',
    featured: true,
    summary: '补充复杂来料、多规格混流下的识别与分拣稳定性展示，让发现页前排内容更完整地覆盖设备能力与应用场景。',
    videoUrl: DISCOVERY_SORTER_STABILITY_VIDEO_URL,
  },
  {
    id: 1,
    title: '工业视觉检测技术应用演示',
    cover: '/Picture/5f45ca8db560b.jpg',
    author: '民崛智能',
    avatar: 'https://ui-avatars.com/api/?name=MJ&background=0D8ABC&color=fff',
    views: 125600,
    likes: 3420,
    duration: '12:35',
    uploadTime: '今天',
    publishDate: '2026-03-25',
    category: 'review',
    tags: ['AI检测', '民崛智能', '产品演示'],
    comments: 234,
    rating: 4.8,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 2,
    title: '自动化生产线智能检测系统',
    cover: '/Picture/9f1b10429b214030ab65eed8d9217246.jpeg',
    author: '民崛智能',
    avatar: 'https://ui-avatars.com/api/?name=MJ&background=22C55E&color=fff',
    views: 89200,
    likes: 2150,
    duration: '15:20',
    uploadTime: '今天',
    publishDate: '2026-03-25',
    category: 'review',
    tags: ['自动化', '生产线', '智能检测'],
    comments: 187,
    rating: 4.9,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 3,
    title: '千元级工业相机选购指南 | 性价比之王终极测试',
    cover: '/Picture/R-C.jpg',
    author: '设备评测室',
    avatar: 'https://ui-avatars.com/api/?name=SB&background=F59E0B&color=fff',
    views: 156000,
    likes: 4230,
    duration: '18:45',
    uploadTime: '1周前',
    publishDate: '2026-03-18',
    category: 'review',
    tags: ['工业相机', '选购指南', '性价比'],
    comments: 456,
    rating: 4.7,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 4,
    title: 'MVTec Halcon vs OpenCV | 机器视觉软件终极对决',
    cover: '/Picture/OIP-C.webp',
    author: '视觉算法工程师',
    avatar: 'https://ui-avatars.com/api/?name=SF&background=EF4444&color=fff',
    views: 67800,
    likes: 1890,
    duration: '25:12',
    uploadTime: '3天前',
    publishDate: '2026-03-22',
    category: 'review',
    tags: ['Halcon', 'OpenCV', '软件对比'],
    comments: 312,
    rating: 4.8,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 5,
    title: '探厂实拍 | 走进深圳AI视觉检测设备制造商',
    cover: '/videos/video-1-cover.jpg',
    author: '工业探厂Vlog',
    avatar: 'https://ui-avatars.com/api/?name=GY&background=8B5CF6&color=fff',
    views: 234000,
    likes: 6780,
    duration: '28:34',
    uploadTime: '2天前',
    publishDate: '2026-03-23',
    category: 'vlog',
    tags: ['探厂', '深圳', 'AI检测'],
    comments: 567,
    rating: 4.9,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 6,
    title: '锂电池生产线实拍 | AOI视觉检测设备工作全流程',
    cover: '/videos/video-2-cover.jpg',
    author: '制造业观察者',
    avatar: 'https://ui-avatars.com/api/?name=ZZ&background=06B6D4&color=fff',
    views: 178000,
    likes: 4560,
    duration: '16:45',
    uploadTime: '4天前',
    publishDate: '2026-03-21',
    category: 'vlog',
    tags: ['锂电池', 'AOI检测', '生产线'],
    comments: 345,
    rating: 4.8,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 7,
    title: '老板的一天 | 视觉设备公司日常Vlog',
    cover: '/Picture/5f45ca8db560b.jpg',
    author: '创业者日记',
    avatar: 'https://ui-avatars.com/api/?name=CY&background=F97316&color=fff',
    views: 98500,
    likes: 2340,
    duration: '12:20',
    uploadTime: '1周前',
    publishDate: '2026-03-18',
    category: 'vlog',
    tags: ['创业', '日常', '公司运营'],
    comments: 234,
    rating: 4.6,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 8,
    title: '跟我一起参加机器视觉展会 | VISION CHINA 2024',
    cover: '/Picture/9f1b10429b214030ab65eed8d9217246.jpeg',
    author: '行业观察',
    avatar: 'https://ui-avatars.com/api/?name=HY&background=84CC16&color=fff',
    views: 145000,
    likes: 3890,
    duration: '32:15',
    uploadTime: '3天前',
    publishDate: '2026-03-22',
    category: 'vlog',
    tags: ['展会', 'VISION', '新品发布'],
    comments: 456,
    rating: 4.9,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 9,
    title: 'Halcon机器视觉完整教程 | 从入门到精通(1/50)',
    cover: '/Picture/OIP-C.webp',
    author: '视觉教程大师',
    avatar: 'https://ui-avatars.com/api/?name=JC&background=DC2626&color=fff',
    views: 567000,
    likes: 15600,
    duration: '45:30',
    uploadTime: '1个月前',
    publishDate: '2026-02-25',
    category: 'tutorial',
    tags: ['Halcon', '教程', '入门'],
    comments: 1234,
    rating: 4.9,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 10,
    title: '工业相机选型与调试实战教程 | 手把手教学',
    cover: '/Picture/R-C.jpg',
    author: '工程师小李',
    avatar: 'https://ui-avatars.com/api/?name=XL&background=7C3AED&color=fff',
    views: 234000,
    likes: 7890,
    duration: '38:12',
    uploadTime: '2周前',
    publishDate: '2026-03-11',
    category: 'tutorial',
    tags: ['工业相机', '选型', '调试'],
    comments: 678,
    rating: 4.8,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 11,
    title: 'AI缺陷检测项目实战 | 从0搭建完整系统',
    cover: '/videos/video-1-cover.jpg',
    author: 'AI视觉工程师',
    avatar: 'https://ui-avatars.com/api/?name=AI&background=2563EB&color=fff',
    views: 189000,
    likes: 6780,
    duration: '52:45',
    uploadTime: '1周前',
    publishDate: '2026-03-18',
    category: 'tutorial',
    tags: ['AI检测', '项目实战', '深度学习'],
    comments: 892,
    rating: 4.9,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 12,
    title: 'PLC与视觉系统通讯教程 | Modbus/TCP协议详解',
    cover: '/videos/video-2-cover.jpg',
    author: '自动化工程师',
    avatar: 'https://ui-avatars.com/api/?name=ZD&background=059669&color=fff',
    views: 123000,
    likes: 4560,
    duration: '28:30',
    uploadTime: '5天前',
    publishDate: '2026-03-20',
    category: 'tutorial',
    tags: ['PLC', '通讯', 'Modbus'],
    comments: 456,
    rating: 4.7,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 13,
    title: '二手设备淘宝记 | 5万元收购一套完整视觉检测系统',
    cover: '/Picture/5f45ca8db560b.jpg',
    author: '设备猎人',
    avatar: 'https://ui-avatars.com/api/?name=SB&background=DC2626&color=fff',
    views: 345000,
    likes: 8900,
    duration: '22:15',
    uploadTime: '3天前',
    publishDate: '2026-03-22',
    category: 'trading',
    tags: ['二手设备', '收购', '性价比'],
    comments: 789,
    rating: 4.8,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 14,
    title: '如何避坑 | 购买工业相机的10个注意事项',
    cover: '/Picture/R-C.jpg',
    author: '采购老司机',
    avatar: 'https://ui-avatars.com/api/?name=CG&background=F59E0B&color=fff',
    views: 267000,
    likes: 7650,
    duration: '18:45',
    uploadTime: '1周前',
    publishDate: '2026-03-18',
    category: 'trading',
    tags: ['避坑指南', '采购', '工业相机'],
    comments: 567,
    rating: 4.9,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 15,
    title: '设备置换实录 | 老设备如何卖出好价格',
    cover: '/Picture/9f1b10429b214030ab65eed8d9217246.jpeg',
    author: '二手市场',
    avatar: 'https://ui-avatars.com/api/?name=ES&background=22C55E&color=fff',
    views: 156000,
    likes: 4230,
    duration: '15:30',
    uploadTime: '4天前',
    publishDate: '2026-03-21',
    category: 'trading',
    tags: ['二手', '置换', '卖设备'],
    comments: 345,
    rating: 4.6,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 16,
    title: '工厂设备拍卖会直击 | 捡漏高端视觉设备',
    cover: '/videos/video-2-cover.jpg',
    author: '拍卖观察',
    avatar: 'https://ui-avatars.com/api/?name=PM&background=8B5CF6&color=fff',
    views: 198000,
    likes: 5670,
    duration: '25:40',
    uploadTime: '2天前',
    publishDate: '2026-03-23',
    category: 'trading',
    tags: ['拍卖', '捡漏', '高端设备'],
    comments: 678,
    rating: 4.7,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 17,
    title: '2024机器视觉行业白皮书解读 | 市场规模突破500亿',
    cover: '/videos/video-1-cover.jpg',
    author: '行业分析师',
    avatar: 'https://ui-avatars.com/api/?name=HY&background=0D8ABC&color=fff',
    views: 456000,
    likes: 12300,
    duration: '35:20',
    uploadTime: '1周前',
    publishDate: '2026-03-18',
    category: 'analysis',
    tags: ['行业报告', '市场分析', '趋势'],
    comments: 1234,
    rating: 4.9,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 18,
    title: 'AI视觉检测技术发展趋势 | 深度学习vs传统算法',
    cover: '/Picture/5f45ca8db560b.jpg',
    author: '技术前沿',
    avatar: 'https://ui-avatars.com/api/?name=JS&background=EF4444&color=fff',
    views: 289000,
    likes: 8900,
    duration: '28:15',
    uploadTime: '3天前',
    publishDate: '2026-03-22',
    category: 'analysis',
    tags: ['AI', '技术趋势', '深度学习'],
    comments: 892,
    rating: 4.8,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 19,
    title: '国产vs进口 | 机器视觉设备竞争格局分析',
    cover: '/videos/video-2-cover.jpg',
    author: '产业观察',
    avatar: 'https://ui-avatars.com/api/?name=CY&background=059669&color=fff',
    views: 234000,
    likes: 6780,
    duration: '32:50',
    uploadTime: '5天前',
    publishDate: '2026-03-20',
    category: 'analysis',
    tags: ['国产化', '进口替代', '竞争分析'],
    comments: 678,
    rating: 4.7,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
  {
    id: 20,
    title: '新能源行业带来的视觉检测机遇 | 千亿市场解析',
    cover: '/Picture/9f1b10429b214030ab65eed8d9217246.jpeg',
    author: '投资观察',
    avatar: 'https://ui-avatars.com/api/?name=TZ&background=F97316&color=fff',
    views: 345000,
    likes: 9870,
    duration: '26:30',
    uploadTime: '2天前',
    publishDate: '2026-03-23',
    category: 'analysis',
    tags: ['新能源', '市场机遇', '投资'],
    comments: 1045,
    rating: 4.9,
    type: 'video',
    videoUrl: DEFAULT_VIDEO_URL,
  },
];

export const getDiscoveryVideoById = (id) =>
  discoveryVideos.find((item) => item.id === Number(id)) || null;

const getHotScore = (item) => (item.likes || 0) + (item.views || 0);

export const getDiscoveryVideos = ({ activeCategory = 'all', sortBy = 'hot' } = {}) => {
  const filtered = activeCategory === 'all'
    ? [...discoveryVideos]
    : discoveryVideos.filter((item) => item.category === activeCategory);

  switch (sortBy) {
    case 'latest':
      filtered.sort((a, b) => b.id - a.id);
      break;
    case 'popular':
      filtered.sort((a, b) => b.views - a.views);
      break;
    case 'liked':
      filtered.sort((a, b) => b.likes - a.likes);
      break;
    default:
      filtered.sort((a, b) => {
        if (activeCategory === 'all' && a.featured && !b.featured) return -1;
        if (activeCategory === 'all' && !a.featured && b.featured) return 1;
        if (activeCategory === 'all' && a.featured && b.featured) return b.id - a.id;
        return getHotScore(b) - getHotScore(a);
      });
      break;
  }

  return filtered;
};

export const getRelatedDiscoveryVideos = (id, limit = 3) => {
  const current = getDiscoveryVideoById(id);
  if (!current) return discoveryVideos.slice(0, limit);

  return discoveryVideos
    .filter((item) => item.id !== current.id)
    .sort((a, b) => {
      if (a.category === current.category && b.category !== current.category) return -1;
      if (a.category !== current.category && b.category === current.category) return 1;
      return b.likes - a.likes;
    })
    .slice(0, limit);
};

export const buildDiscoveryVideoDetail = (id) => {
  const video = getDiscoveryVideoById(id);
  if (!video) return null;

  const description = video.description || `${video.author}围绕“${video.tags.join(' / ')}”做了一次完整拆解，适合想快速了解工业视觉设备、方案选型和落地经验的采购与供应团队参考。`;
  const sections = Array.isArray(video.sections) && video.sections.length > 0
    ? video.sections
    : [
      {
        title: '这条内容讲了什么',
        paragraphs: [
          `视频围绕 ${video.title} 展开，从设备能力、落地场景到选型建议做了完整串联。`,
          `如果你正在评估 ${video.tags[0]} 相关方案，这条内容能帮你更快抓到关键判断点。`,
        ],
      },
      {
        title: '你可以重点关注',
        bullets: [
          `${video.tags[0]} 的实际适配场景与上线节奏`,
          `采购前需要确认的核心参数与交付边界`,
          `行业内常见踩坑点以及更稳妥的替代方案`,
        ],
      },
      {
        title: '适合谁看',
        paragraphs: [
          '适合采购工程师、设备选型负责人、供应商销售和方案顾问快速补课。',
        ],
      },
    ];

  return {
    ...video,
    thumbnail: video.thumbnail || video.cover,
    authorAvatar: video.authorAvatar || video.avatar,
    description,
    sections,
    articlePages: video.type === 'article' ? paginateArticleSections(sections) : null,
  };
};
