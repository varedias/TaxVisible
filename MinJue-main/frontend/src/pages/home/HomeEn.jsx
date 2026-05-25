import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Play, FileText, Eye, Building2, Clock, Menu, X } from 'lucide-react';
import { productApi } from '../../api/product';
import { supplierApi, procurementApi } from '../../api/index';
import AIAssistantFloat, { AIAssistantButton } from '../../components/AIAssistantFloat';
import { discoveryVideos } from '../../data/discoveryVideos';

const HomeEn = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Real data states
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [discoveryContent, setDiscoveryContent] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState({ products: true, suppliers: true, content: true, procurements: true });

  // Load homepage data
  useEffect(() => {
    document.title = 'DongShiDi Global - AI Vision Detection Leader';
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    await Promise.all([
      loadProducts(),
      loadSuppliers(),
      loadContent(),
      loadProcurements()
    ]);
  };

  const loadProducts = async () => {
    try {
      const res = await productApi.getList({ page: 1, size: 6 });
      if (res && res.records) {
        setFeaturedProducts(res.records);
      }
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const loadSuppliers = async () => {
    try {
      const data = await supplierApi.getList(1, 6);
      if (data && data.records) {
        setSupplierList(data.records);
      }
    } catch (e) {
      console.error('Failed to load suppliers:', e);
    } finally {
      setLoading(prev => ({ ...prev, suppliers: false }));
    }
  };

  const loadContent = async () => {
    try {
      setDiscoveryContent(getFeaturedDiscoveryContent());
    } catch (e) {
      console.error('Failed to load content:', e);
    } finally {
      setLoading(prev => ({ ...prev, content: false }));
    }
  };

  const loadProcurements = async () => {
    try {
      const data = await procurementApi.getList({ page: 1, size: 6 });
      if (data && data.records) {
        setProcurements(data.records);
      }
    } catch (e) {
      console.error('Failed to load procurement:', e);
    } finally {
      setLoading(prev => ({ ...prev, procurements: false }));
    }
  };

  // Helper: image path handling
  const getImagePath = (path, type = 'product') => {
    if (!path) return `/products/placeholder-${type}.svg`;
    if (path.startsWith('http')) return path;
    return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
  };

  // Image fallback
  const handleImageError = (e) => {
    e.target.src = '/products/placeholder-product.svg';
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/en/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getDiscoveryTypeLabel = (type) => {
    if (type === 'article') return 'Article';
    if (type === 'vlog') return 'Factory Tour';
    return 'Video';
  };

  const getDiscoveryCategoryLabel = (category) => {
    if (category === 'review') return 'Review';
    if (category === 'tutorial') return 'Buying Guide';
    if (category === 'vlog') return 'Factory Visit';
    if (category === 'analysis') return 'Industry Insight';
    if (category === 'trading') return 'Market Update';
    return 'Featured';
  };

  const getDiscoverySummary = (item) => {
    if (item.summary) return item.summary;
    const [primaryTag = 'Industrial Vision', secondaryTag = 'Equipment Selection'] = item.tags || [];
    return `${item.author} shares insights on ${primaryTag}, ${secondaryTag}, and ${getDiscoveryCategoryLabel(item.category)} — great for understanding use cases, solution highlights, and procurement tips.`;
  };

  const getFeaturedDiscoveryContent = () => {
    const rankedVideos = [...discoveryVideos].sort((a, b) => {
      const scoreA = (a.views || 0) + (a.likes || 0) * 20;
      const scoreB = (b.views || 0) + (b.likes || 0) * 20;
      return scoreB - scoreA;
    });

    const preferredCategories = ['review', 'vlog', 'tutorial', 'analysis'];
    const curatedItems = preferredCategories
      .map((category) => rankedVideos.find((item) => item.category === category))
      .filter(Boolean);

    const fallbackItems = rankedVideos.filter(
      (item) => !curatedItems.some((selectedItem) => selectedItem.id === item.id)
    );

    return [...curatedItems, ...fallbackItems]
      .slice(0, 4)
      .map((item) => ({
        ...item,
        summary: getDiscoverySummary(item),
      }));
  };

  // Full equipment categories (English)
  const equipmentCategories = [
    {
      id: 1,
      name: 'AI Vision Inspection',
      subcategories: [
        { name: '2D Vision Inspection', products: ['Surface Defect Detection', 'Dimensional Measurement', 'OCR Character Recognition', 'Barcode Scanning', 'Surface Quality Inspection'] },
        { name: '3D Vision Inspection', products: ['Laser Triangulation', 'Structured Light Scanning', 'Time-of-Flight (ToF)', 'Stereo Vision', 'Line Laser Profilometry'] },
        { name: 'Intelligent Sorting', products: ['Vision-Guided Sorting', 'Delta Parallel Robots', 'Color Recognition Sorting', 'Shape Recognition Sorting', 'Mixed Material Sorting'] },
        { name: 'AI Deep Learning', products: ['Defect Recognition Algo', 'Object Detection Systems', 'Image Classification', 'Semantic Segmentation', 'Instance Segmentation'] },
        { name: 'Inline Inspection', products: ['High-Speed Inspection', 'Continuous Line Inspection', 'Real-Time Quality Monitor', 'Data Traceability', 'MES Integration'] }
      ]
    },
    {
      id: 2,
      name: 'Industrial Cameras',
      subcategories: [
        { name: 'Area Scan Cameras', products: ['CCD Cameras', 'CMOS Cameras', 'High-Resolution Cameras', 'High-Speed Cameras', 'Low-Light Cameras'] },
        { name: 'Line Scan Cameras', products: ['Single-Line Scan', 'Multi-Line Scan', 'Color Line Scan', 'Infrared Line Scan', 'TDI Line Scan'] },
        { name: 'Smart Cameras', products: ['Embedded Vision', 'All-in-One Cameras', 'AI Smart Cameras', 'Edge Computing Cameras', 'Industrial IoT Cameras'] },
        { name: 'Specialty Cameras', products: ['Thermal Imaging', 'UV Cameras', 'Hyperspectral Cameras', 'X-Ray Cameras', 'Polarization Cameras'] },
        { name: '3D Cameras', products: ['ToF Cameras', 'Structured Light', 'Stereo Cameras', 'Laser Profiling', 'Light Field Cameras'] }
      ]
    },
    {
      id: 3,
      name: 'Lenses & Lighting',
      subcategories: [
        { name: 'Industrial Lenses', products: ['Fixed-Focal Lenses', 'Zoom Lenses', 'Telecentric Lenses', 'Fisheye Lenses', 'Line Scan Lenses'] },
        { name: 'LED Lighting', products: ['Ring Lights', 'Bar Lights', 'Backlights', 'Coaxial Lights', 'AOI Lights'] },
        { name: 'Specialty Lighting', products: ['UV Lighting', 'IR Lighting', 'Laser Lighting', 'X-Ray Lighting', 'Multispectral Lighting'] },
        { name: 'Light Controllers', products: ['Constant Current', 'Strobe Controllers', 'Dimming Controllers', 'Multi-Channel', 'PWM Controllers'] },
        { name: 'Optical Accessories', products: ['Polarizing Filters', 'Optical Filters', 'Diffusers', 'Fiber Optic Guides', 'Integrating Spheres'] }
      ]
    },
    {
      id: 4,
      name: 'Frame Grabbers',
      subcategories: [
        { name: 'PCIe Frame Grabbers', products: ['Single-Channel', 'Multi-Channel', 'High-Speed', 'GPU-Based', 'FPGA-Based'] },
        { name: 'USB Frame Grabbers', products: ['USB 3.0', 'USB 3.1', 'External Boxes', 'Portable', 'USB 3.2'] },
        { name: 'Specialty Interface', products: ['Camera Link', 'CoaXPress', 'GigE', '10GigE', '25GigE'] },
        { name: 'Image Processing', products: ['FPGA Processing', 'GPU Processing', 'DSP Processing', 'AI Acceleration', 'NPU Processing'] },
        { name: 'Video Capture', products: ['HDMI Capture', 'SDI Capture', 'Analog Capture', '4K Capture', '8K Capture'] }
      ]
    },
    {
      id: 5,
      name: 'Vision Software',
      subcategories: [
        { name: 'Image Processing', products: ['Halcon', 'VisionPro', 'OpenCV', 'Matlab Vision', 'LabVIEW Vision'] },
        { name: 'AI Training Platforms', products: ['TensorFlow', 'PyTorch', 'Deep Learning Frameworks', 'Model Training Tools', 'AutoML Platforms'] },
        { name: '3D Vision Software', products: ['Point Cloud Processing', '3D Reconstruction', '3D Measurement', 'CAD Comparison', 'Reverse Engineering'] },
        { name: 'Robot Vision', products: ['Vision Positioning', 'Trajectory Planning', 'Hand-Eye Calibration', 'Robot Guidance', 'Grasp Planning'] },
        { name: 'Quality Management', products: ['MES Systems', 'SPC Statistics', 'Traceability Systems', 'Reporting & Analytics', 'BI Dashboards'] }
      ]
    },
    {
      id: 6,
      name: 'Robotics & Automation',
      subcategories: [
        { name: 'Industrial Robots', products: ['6-Axis Robots', 'SCARA Robots', 'Delta Robots', 'Collaborative Robots', 'AGV Robots'] },
        { name: 'Mechanical Grippers', products: ['Pneumatic Grippers', 'Electric Grippers', 'Servo Grippers', 'Vacuum Cups', 'Jaw Grippers'] },
        { name: 'Conveyor Systems', products: ['Belt Conveyors', 'Chain Conveyors', 'Roller Conveyors', 'Flexible Conveyors', 'Spiral Conveyors'] },
        { name: 'Positioning Systems', products: ['Linear Stages', 'Rotary Stages', 'XYZ Stages', '6-DOF Platforms', 'Voice Coil Stages'] },
        { name: 'Control Systems', products: ['PLC Controllers', 'Motion Control Cards', 'Servo Drives', 'Touchscreen HMI', 'Industrial PCs'] }
      ]
    },
    {
      id: 7,
      name: 'Measuring Instruments',
      subcategories: [
        { name: 'Laser Measurement', products: ['Laser Distance', 'Laser Profiling', 'Laser Trackers', 'Laser Interferometers', 'Laser Scanners'] },
        { name: 'Optical Measurement', products: ['Video Measuring Machines', 'Optical Microscopes', 'Toolmaker Microscopes', 'Profile Projectors', 'Contour Projectors'] },
        { name: 'Contact Measurement', products: ['CMM', 'Contour Instruments', 'Surface Roughness', 'Roundness Testers', 'Hardness Testers'] },
        { name: 'Inline Measurement', products: ['Inline Thickness', 'Inline Width', 'Inline Dimension', 'Inline Weight', 'Inline Defect Detection'] },
        { name: 'Spectral Analysis', products: ['Spectrometers', 'Colorimeters', 'Gloss Meters', 'Whiteness Meters', 'Haze Meters'] }
      ]
    },
    {
      id: 8,
      name: 'Construction Machinery',
      subcategories: [
        { name: 'Excavators', products: ['Large Excavators (40-100t)', 'Ultra-Large (100t+)', 'Medium Excavators (13-40t)', 'Small Excavators (<13t)', 'Mini Excavators'] },
        { name: 'Earthmoving Equipment', products: ['Bulldozers', 'Graders', 'Scrapers', 'Wheel Loaders', 'Skid-Steer Loaders'] },
        { name: 'Lifting Equipment', products: ['Truck Cranes', 'Crawler Cranes', 'Tower Cranes', 'Gantry Cranes', 'Overhead Cranes'] },
        { name: 'Compaction Equipment', products: ['Road Rollers', 'Tamping Rammers', 'Vibratory Rollers', 'Pneumatic Rollers', 'Impact Compactors'] },
        { name: 'Road Construction', products: ['Asphalt Pavers', 'Concrete Plants', 'Cold Milling Machines', 'Crack Sealers', 'Road Marking Machines'] }
      ]
    },
    {
      id: 9,
      name: 'Hotel Supplies',
      subcategories: [
        { name: 'Room Linens', products: ['Bed Sheets', 'Duvet Covers', 'Pillowcases', 'Towels', 'Bathrobes'] },
        { name: 'Disposable Amenities', products: ['Toothbrushes', 'Toothpaste', 'Shampoo', 'Body Wash', 'Slippers'] },
        { name: 'Room Appliances', products: ['Electric Kettles', 'Hair Dryers', 'Desk Lamps', 'Safes', 'Mini Fridges'] },
        { name: 'Catering Equipment', products: ['Coffee Machines', 'Ice Makers', 'Dishwashers', 'Sterilization Cabinets', 'Ovens'] },
        { name: 'Cleaning Supplies', products: ['Vacuums', 'Cleaning Agents', 'Trash Bins', 'Mops', 'Cleaning Cloths'] }
      ]
    },
    {
      id: 10,
      name: 'Water Industry',
      subcategories: [
        { name: 'Pumps, Valves & Pipes', products: ['Centrifugal Pumps', 'Gate Valves', 'Steel Pipes', 'Plastic Pipes', 'Ball Valves'] },
        { name: 'Water Treatment', products: ['Water Purifiers', 'RO Systems', 'Disinfection Equipment', 'Filters', 'Reverse Osmosis'] },
        { name: 'Instruments & Meters', products: ['Flow Meters', 'Pressure Gauges', 'Water Quality Analyzers', 'Level Meters', 'pH Meters'] },
        { name: 'Pump Systems', products: ['Submersible Pumps', 'Sewage Pumps', 'Booster Pumps', 'Circulation Pumps', 'Variable Frequency Supply'] },
        { name: 'Treatment Chemicals', products: ['Flocculants', 'Disinfectants', 'Scale Inhibitors', 'Algaecides', 'pH Adjusters'] }
      ]
    },
    {
      id: 11,
      name: 'Electronic Components',
      subcategories: [
        { name: 'Passive Components', products: ['Resistors', 'Capacitors', 'Inductors', 'Transformers', 'Crystal Oscillators'] },
        { name: 'Active Components', products: ['Diodes', 'Transistors', 'MOSFETs', 'IGBTs', 'Integrated Circuits'] },
        { name: 'Connectors', products: ['Pin Headers', 'Terminal Blocks', 'USB Connectors', 'HDMI Interfaces', 'Ethernet Interfaces'] },
        { name: 'Sensors', products: ['Temperature Sensors', 'Pressure Sensors', 'Displacement Sensors', 'Photoelectric Sensors', 'Accelerometers'] },
        { name: 'Display Devices', products: ['LED Lights', 'LCD Screens', 'OLED Screens', 'Nixie Tubes', 'Dot Matrix Displays'] }
      ]
    },
    {
      id: 12,
      name: 'Packaging Equipment',
      subcategories: [
        { name: 'Packaging Machinery', products: ['Sealing Machines', 'Vacuum Packers', 'Shrink Wrappers', 'Labeling Machines', 'Strapping Machines'] },
        { name: 'Filling Equipment', products: ['Liquid Fillers', 'Powder Fillers', 'Granule Fillers', 'Paste Fillers', 'Automatic Filling Lines'] },
        { name: 'Packaging Materials', products: ['Plastic Films', 'Cartons', 'Pallets', 'Cushioning Materials', 'Labels'] },
        { name: 'Palletizing Equipment', products: ['Palletizing Robots', 'Automatic Palletizers', 'Depalletizers', 'Conveyor Systems', 'Storage Systems'] },
        { name: 'Inspection Equipment', products: ['Metal Detectors', 'X-Ray Inspectors', 'Weight Checkers', 'Vision Inspection', 'Leak Detectors'] }
      ]
    }
  ];

  const activeEquipmentCategory = equipmentCategories.find((category) => category.id === selectedCategory);

  return (
    <div className="pb-20 md:pb-0 bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search equipment categories, product models, suppliers..."
                className="w-full bg-gray-50 text-gray-900 rounded-lg py-4 pl-12 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-10 py-4 rounded-lg font-medium hover:from-slate-800 hover:to-slate-900 transition-all shadow-md"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Discovery & Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10 mb-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-1 h-8 bg-slate-700 rounded-full"></span>
                Discovery & Recommendations
              </h2>
              {/* subtitle removed */}
            </div>
            <button
              onClick={() => navigate('/en/discovery')}
              className="text-slate-700 text-sm hover:text-slate-800 font-medium flex items-center gap-1 group flex-shrink-0"
            >
              View More
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {loading.content ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-64 lg:h-72 bg-gray-200"></div>
                  <div className="p-6 lg:p-7">
                    <div className="h-4 bg-gray-200 rounded mb-3 w-24"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3 w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3 w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6 w-3/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : discoveryContent.length > 0 ? (
              discoveryContent.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/en/content/${item.id}`)}
                className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all cursor-pointer bg-white flex flex-col"
              >
                <div className="relative h-64 lg:h-72 bg-gray-100 overflow-hidden">
                  <img
                    src={getImagePath(item.cover || item.thumbnail)}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={handleImageError}
                  />
                  {(item.type === 'video' || item.type === 'vlog') && (
                    <>
                      <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 flex items-center justify-center transition-all z-10 pointer-events-none">
                        <div className="bg-white/90 rounded-full p-4 lg:p-5 group-hover:bg-slate-700 transition-colors shadow-lg">
                          <Play size={30} className="text-slate-700 group-hover:text-white" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6 lg:p-7 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      item.type === 'article'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {item.type === 'article' && <FileText size={12} className="inline mr-1" />}
                      {getDiscoveryTypeLabel(item.type)}
                    </span>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      {getDiscoveryCategoryLabel(item.category)}
                    </span>
                    {item.uploadTime && (
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-orange-50 text-orange-600">
                        {item.uploadTime}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-xl leading-9 text-gray-900 line-clamp-3 mb-3 group-hover:text-slate-700 min-h-[108px]">
                    {item.title}
                  </h3>
                  <p className="text-sm lg:text-[15px] leading-7 text-gray-500 line-clamp-3 min-h-[84px] mb-5">
                    {item.summary}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(item.tags || []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-500 gap-4 pt-4 border-t border-gray-100">
                    <span className="font-medium truncate">{item.author}</span>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="flex items-center gap-1">
                        <Eye size={14} /> {(item.views || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-12">No featured content</div>
            )}
          </div>
        </div>

        {/* Equipment Categories */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 px-8 py-5 flex items-center justify-between">
            <h2 className="text-white font-bold text-2xl flex items-center gap-3">
              <span className="w-1 h-8 bg-white rounded-full"></span>
              Equipment Categories
            </h2>
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className={`
              w-full md:w-72 lg:w-80 border-r border-gray-200 flex-shrink-0 bg-gray-50
              ${isMobileMenuOpen ? 'block' : 'hidden md:block'}
            `}>
              <div className="h-full">
                {equipmentCategories.map((category, index) => (
                  <div
                    key={category.id}
                    className={`
                      px-6 py-5 border-b border-gray-200 cursor-pointer transition-all duration-200
                      ${selectedCategory === category.id
                        ? 'bg-slate-700 text-white border-l-4 border-l-white shadow-md'
                        : 'hover:bg-white hover:shadow-sm text-gray-700 hover:text-slate-700'
                      }
                    `}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0
                          ${selectedCategory === category.id
                            ? 'bg-white text-slate-700'
                            : 'bg-slate-100 text-slate-700 group-hover:bg-slate-700 group-hover:text-white'
                          }
                          transition-colors
                        `}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-semibold text-base leading-6">{category.name}</span>
                      </div>
                      <ChevronRight
                        size={20}
                        className={`
                          flex-shrink-0 transition-transform
                          ${selectedCategory === category.id ? 'rotate-180 text-white' : 'text-gray-400 group-hover:text-slate-700'}
                        `}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-grow bg-white min-h-[600px]">
              {selectedCategory ? (
                <div className="p-8 animate-fadeIn">
                  <div className="mb-8 pb-6 border-b-2 border-gray-200">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {activeEquipmentCategory?.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {activeEquipmentCategory?.subcategories.length} subcategories ·
                      Verified suppliers · Full technical support
                    </p>
                  </div>

                  <div className="space-y-8">
                    {activeEquipmentCategory?.subcategories.map((sub, subIdx) => (
                      <div
                        key={subIdx}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-1 h-6 bg-slate-700 rounded-full"></div>
                          <h4 className="font-bold text-xl text-gray-900">
                            {sub.name}
                          </h4>
                          <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            {sub.products.length} Products
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                          {sub.products.map((product, pIdx) => (
                            <React.Fragment key={pIdx}>
                              <span className="text-sm text-gray-700 hover:text-slate-700 cursor-pointer hover:font-medium transition-all px-2 py-1 rounded hover:bg-slate-50">
                                {product}
                              </span>
                              {pIdx < sub.products.length - 1 && (
                                <span className="text-gray-300">|</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-gray-400">
                  <div className="w-32 h-32 mb-6 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center">
                    <Search size={64} className="text-slate-300" />
                  </div>
                  <p className="text-xl font-medium text-gray-500 mb-2">Please select a category</p>
                  <p className="text-sm text-gray-400">Click a category on the left to view detailed subcategories and product info</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-1 h-8 bg-slate-700 rounded-full"></span>
                Featured Products
              </h2>
              <p className="text-sm text-gray-500 mt-2 ml-5">Prices are for reference only, please contact suppliers for actual pricing</p>
            </div>
            <button onClick={() => navigate('/en/mall')} className="text-slate-700 text-sm hover:text-slate-800 font-medium flex items-center gap-1 group">
              View More
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {loading.products ? (
              [1,2,3,4,5,6].map(i => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="h-36 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/en/product/${product.id}`)}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div className="h-36 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={getImagePath(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={handleImageError}
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[40px] group-hover:text-slate-700">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs text-gray-400">Sold {product.sales || 0}</span>
                  <span className="text-xs text-gray-400 ml-auto">Views {product.views || 0}</span>
                </div>
                <div className="text-red-500 font-bold">
                  CNY <span className="text-lg">{Number(product.price || 0).toLocaleString()}</span>
                  <span className="text-xs text-gray-500 font-normal">/unit</span>
                </div>
              </div>
              ))
            ) : (
              <div className="col-span-6 text-center text-gray-400 py-12">No products available</div>
            )}
          </div>
        </div>

        {/* Verified Suppliers */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-1 h-8 bg-slate-700 rounded-full"></span>
              Verified Suppliers
            </h2>
            <button onClick={() => navigate('/en/suppliers')} className="text-slate-700 text-sm hover:text-slate-800 font-medium flex items-center gap-1 group">
              More Suppliers
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading.suppliers ? (
              [1,2].map(i => (
                <div key={i} className="border border-gray-200 rounded-xl p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                    <div className="flex-grow"><div className="h-5 bg-gray-200 rounded mb-3 w-1/3"></div><div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div></div>
                  </div>
                </div>
              ))
            ) : supplierList.length > 0 ? (
              supplierList.map((supplier) => (
              <div
                key={supplier.id}
                onClick={() => navigate(`/en/supplier/${supplier.id}`)}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {supplier.logo ? (
                      <img src={getImagePath(supplier.logo, 'supplier')} alt={supplier.name} className="w-full h-full object-cover" onError={handleImageError} />
                    ) : (
                      <Building2 size={32} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-slate-700">{supplier.name}</h3>
                      {supplier.isVerified && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Verified</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {supplier.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {supplier.contactInfo && (
                        <span className="flex items-center gap-1">
                          <Building2 size={14} className="text-slate-600" />
                          Contact info available
                        </span>
                      )}
                      {supplier.createTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} className="text-gray-400" />
                          Joined {supplier.createTime.substring(0, 10)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-400 py-12">No suppliers available</div>
            )}
          </div>
        </div>

        {/* Latest Procurement */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-1 h-8 bg-slate-700 rounded-full"></span>
              Latest Procurement
            </h2>
            <button onClick={() => navigate('/en/suppliers')} className="text-slate-700 text-sm hover:text-slate-800 font-medium flex items-center gap-1 group">
              View All
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="space-y-4">
            {procurements.length > 0 ? procurements.map((procurement) => (
              <div
                key={procurement.id}
                className="border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex-grow pr-4 group-hover:text-slate-700 text-base">
                    {procurement.title}
                  </h3>
                  <span className="text-xs text-gray-400 flex-shrink-0 bg-gray-50 px-2 py-1 rounded">
                    {procurement.createTime ? new Date(procurement.createTime).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400">Qty:</span>
                    <span className="font-medium text-gray-900">{procurement.quantity || '-'} units</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400">Budget:</span>
                    <span className="font-medium text-orange-600">
                      {procurement.budgetMin && procurement.budgetMax
                        ? `CNY ${Number(procurement.budgetMin).toLocaleString()} - ${Number(procurement.budgetMax).toLocaleString()}`
                        : 'Negotiable'}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400">Deadline:</span>
                    <span className="font-medium text-red-600">{procurement.deadline || 'TBD'}</span>
                  </span>
                </div>
                {procurement.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-1">{procurement.description}</p>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/en/procurement/${procurement.id}`);
                    }}
                    className="flex-1 px-5 py-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-medium rounded-lg hover:from-slate-800 hover:to-slate-900 transition-all shadow-md"
                  >
                    Submit Quote
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/en/procurement/${procurement.id}`);
                    }}
                    className="flex-1 px-5 py-2 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-slate-700 hover:text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-12">No procurement listings</div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Floating Button */}
      {!isAIAssistantOpen && (
        <AIAssistantButton onClick={() => setIsAIAssistantOpen(true)} />
      )}

      {/* AI Assistant Floating Window */}
      <AIAssistantFloat
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
};

export default HomeEn;
