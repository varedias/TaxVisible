-- Replace product images and product content with the equipment assets added on 2026-04-25.
-- Run on local or server MySQL:
--   mysql -u <user> -p <database_name> < update_equipment_products_20260425.sql
--
-- Asset prerequisite:
--   Deploy frontend/public/products/equipment/* to the frontend public assets directory.

SET NAMES utf8mb4;

START TRANSACTION;

UPDATE pms_product
SET
  supplier_id = 4,
  category_id = 1,
  name = '精质视觉 铜板带箔表面检测设备',
  price = 65000.00,
  original_price = 78000.00,
  image = '/products/equipment/equipment-01-jingzhi-copper-strip-surface-inspection.jpeg',
  album = JSON_ARRAY(),
  description = '面向铜板、铜带、铜箔等金属卷材表面质量检测场景，支持在线表面瑕疵识别、缺陷定位和质量追溯，适用于有色金属加工、分切和复卷产线。',
  specs = JSON_OBJECT(
    '品牌', '精质视觉',
    '设备类型', '铜板带箔表面检测设备',
    '检测对象', '铜板、铜带、铜箔等金属卷材',
    '应用场景', '表面缺陷在线检测、质量追溯、产线质检',
    '参考价格', '65000元'
  ),
  status = 1
WHERE id = 1;

UPDATE pms_product
SET
  supplier_id = 3,
  category_id = 1,
  name = '轩田科技 STK VI AMB AOI 自动光学检测设备',
  price = 60000.00,
  original_price = 72000.00,
  image = '/products/equipment/equipment-02-xuantian-stk-vi-amb-aoi.png',
  album = JSON_ARRAY('/products/equipment/equipment-02-xuantian-stk-vi-amb-aoi-specs.png'),
  description = '适用于工业零部件和外观件的AOI自动光学检测，可结合多工位视觉检测流程识别尺寸异常、混料和表面裂纹等问题。',
  specs = JSON_OBJECT(
    '品牌', '轩田科技',
    '型号', 'STK VI AMB AOI',
    '设备类型', 'AOI自动光学检测设备',
    '整机尺寸', '1200x1500x1950mm',
    '检测速度', '50-200pcs/min',
    '气压规格', '0.4-0.6MPa',
    '电压频率', '380V/50Hz, 220V/50Hz',
    '功率', '6-8kW',
    '检测项目', '尺寸、混料、裂纹缺陷检测',
    '参考价格', '60000元'
  ),
  status = 1
WHERE id = 2;

UPDATE pms_product
SET
  supplier_id = 3,
  category_id = 1,
  name = '海康威视 X光智能异物检测系统 ISD-NFX1625D',
  price = 75000.00,
  original_price = 90000.00,
  image = '/products/equipment/equipment-03-hikvision-xray-foreign-object-inspection.png',
  album = JSON_ARRAY('/products/equipment/equipment-03-hikvision-xray-foreign-object-inspection-specs.png'),
  description = '用于食品、包装和工业品产线的X光智能异物检测，支持不锈钢机身、链板输送和在线高速检测，适合对异物、缺件和质量异常进行自动识别。',
  specs = JSON_OBJECT(
    '品牌', '海康威视',
    '型号', 'ISD-NFX1625D',
    '设备类型', 'X光智能异物检测系统',
    '通道口宽度', '160mm',
    '通道口高度', '250mm',
    '整机尺寸', '2150(H)x4200(L)x1500(W)mm',
    '整机重量', '1000kg',
    '机壳材料', '不锈钢SUS304',
    '传送带材料', '食品级PP链板',
    '传送带宽度', '150mm',
    '传送速度', '30-60m/min',
    '最大负载', '15kg',
    '参考价格', '75000元'
  ),
  status = 1
WHERE id = 3;

UPDATE pms_product
SET
  supplier_id = 1,
  category_id = 1,
  name = '民崛智能 AI探伤设备',
  price = 35000.00,
  original_price = 42000.00,
  image = '/products/equipment/equipment-04-minjue-ai-flaw-detector.png',
  album = JSON_ARRAY('/products/equipment/equipment-04-minjue-ai-flaw-detector-specs.jpg'),
  description = '面向铁磁性金属零部件探伤检测场景，结合磁粉喷淋和多工位AI视觉检测，适用于裂纹、混料、尺寸异常等缺陷识别。',
  specs = JSON_OBJECT(
    '品牌', '民崛智能',
    '设备类型', 'AI探伤设备',
    '整机尺寸', '1200x1500x1950mm',
    '检测速度', '50-200pcs/min',
    '气压规格', '0.4-0.6MPa',
    '电压频率', '380V/50Hz, 220V/50Hz',
    '功率', '6-8kW',
    '适用产品', '铁磁性金属零件',
    '检测项目', '尺寸、混料、裂纹缺陷检测',
    '参考价格', '35000元'
  ),
  status = 1
WHERE id = 4;

UPDATE pms_product
SET
  supplier_id = 1,
  category_id = 1,
  name = '民崛智能 AI双吸盘磁吸视觉检测设备',
  price = 46000.00,
  original_price = 55200.00,
  image = '/products/equipment/equipment-05-minjue-ai-dual-suction-magnetic-vision-inspection.jpg',
  album = JSON_ARRAY('/products/equipment/equipment-05-minjue-ai-dual-suction-magnetic-vision-inspection-specs.jpg'),
  description = '采用双吸盘磁吸结构配合AI视觉检测，可用于金属工件上下料、定位和缺陷识别，适合需要稳定夹持和视觉复检的自动化工位。',
  specs = JSON_OBJECT(
    '品牌', '民崛智能',
    '设备类型', 'AI双吸盘磁吸视觉检测设备',
    '整机尺寸', '1200x1500x1950mm',
    '检测速度', '50-200pcs/min',
    '气压规格', '0.4-0.6MPa',
    '电压频率', '380V/50Hz, 220V/50Hz',
    '功率', '6-8kW',
    '适用产品', '铁磁性金属零件',
    '检测项目', '尺寸、混料、裂纹缺陷检测',
    '参考价格', '46000元'
  ),
  status = 1
WHERE id = 5;

UPDATE pms_product
SET
  supplier_id = 1,
  category_id = 1,
  name = '民崛智能 AI外观检测设备',
  price = 40000.00,
  original_price = 48000.00,
  image = '/products/equipment/equipment-06-minjue-ai-appearance-inspection.png',
  album = JSON_ARRAY('/products/equipment/equipment-06-minjue-ai-appearance-inspection-specs.jpg'),
  description = '适用于圆盘式和挂盘式工件外观筛选，支持多相机检测、尺寸与外观缺陷识别，可按精度要求进行方案定制。',
  specs = JSON_OBJECT(
    '品牌', '民崛智能',
    '设备类型', 'AI外观检测设备',
    '可选机型', '500/600/800挂盘机',
    '整机尺寸', '1200x1200x1950mm 或 1500x1500x1950mm',
    '筛选精度', '±0.01mm',
    '相机数量', '1-10个或6-16个',
    '圆盘直径', '500mm/600mm/800mm',
    '检测速度', '50-1000pcs/min',
    '气压规格', '0.4-0.6MPa',
    '电压频率', '220V/50Hz',
    '功率', '3-4kW',
    '检测项目', '尺寸、外观缺陷、混料、裂纹缺陷检测',
    '参考价格', '40000元'
  ),
  status = 1
WHERE id = 6;

UPDATE pms_product
SET
  supplier_id = 1,
  category_id = 2,
  name = 'AI光学筛选机',
  price = 35000.00,
  original_price = 42000.00,
  image = '/products/equipment/equipment-07-ai-optical-sorter.png',
  album = JSON_ARRAY('/products/equipment/equipment-07-ai-optical-sorter-specs.jpg'),
  description = '用于小型工件高速光学筛选和外观缺陷检测，支持多相机配置、圆盘式送料和尺寸精度筛选，适合批量自动化检测场景。',
  specs = JSON_OBJECT(
    '设备类型', 'AI光学筛选机',
    '可选机型', '500/600/800挂盘机',
    '整机尺寸', '1200x1200x1950mm 或 1500x1500x1950mm',
    '筛选精度', '±0.01mm',
    '相机数量', '1-10个或6-16个',
    '圆盘直径', '500mm/600mm/800mm',
    '检测速度', '50-1000pcs/min',
    '气压规格', '0.4-0.6MPa',
    '电压频率', '220V/50Hz',
    '功率', '3-4kW',
    '检测项目', '尺寸和外观缺陷检测',
    '参考价格', '35000元'
  ),
  status = 1
WHERE id = 7;

UPDATE pms_product
SET
  supplier_id = 1,
  category_id = 1,
  name = '民崛智能 AI在线视觉检测设备',
  price = 60000.00,
  original_price = 72000.00,
  image = '/products/equipment/equipment-08-minjue-ai-online-vision-inspection.jpg',
  album = JSON_ARRAY(),
  description = '面向产线在线质检场景，集成AI视觉识别、在线检测和异常分拣能力，可用于外观缺陷、尺寸异常和生产过程质量监控。',
  specs = JSON_OBJECT(
    '品牌', '民崛智能',
    '设备类型', 'AI在线视觉检测设备',
    '检测方式', '在线视觉检测',
    '应用场景', '产线外观检测、尺寸异常识别、质量监控',
    '服务支持', '可按工件和产线节拍定制',
    '参考价格', '60000元'
  ),
  status = 1
WHERE id = 8;

COMMIT;

SELECT id, supplier_id, category_id, name, price, original_price, image, album, specs, status
FROM pms_product
WHERE id BETWEEN 1 AND 8
ORDER BY id;
