-- 更新产品图片为本地 SVG 图片
-- 请在 MySQL 客户端中执行此脚本

-- 产品 ID 7: CCS LED环形光源 LDR2-100
UPDATE pms_product SET image = '/products/led-ring-light.svg' WHERE id = 7;

-- 产品 ID 6: Basler ace系列工业相机套装
UPDATE pms_product SET image = '/products/industrial-camera.svg' WHERE id = 6;

-- 产品 ID 5: 海康威视AI视觉检测系统 VIS-2000
UPDATE pms_product SET image = '/products/ai-vision-system.svg' WHERE id = 5;

-- 产品 ID 4: 牧河自动化上料机 MH-FL-200
UPDATE pms_product SET image = '/products/auto-feeder.svg' WHERE id = 4;

-- 产品 ID 2: 民崛智能模具保护监视器 MJ-MP-PRO
UPDATE pms_product SET image = '/products/mold-protector.svg' WHERE id = 2;

-- 产品 ID 10: 远心镜头 50mm
UPDATE pms_product SET image = '/products/telecentric-lens.svg' WHERE id = 10;

-- 产品 ID 8: 民崛智能模具视觉监测装置 MJ-VIS-A8 (假设)
UPDATE pms_product SET image = '/products/vision-monitor.svg' WHERE id = 8;

-- 产品 ID 9: 民崛智能缺陷检测系统 MJ-QC-3000 (假设)
UPDATE pms_product SET image = '/products/qc-system.svg' WHERE id = 9;

-- 更新其他含 unsplash 的产品图片为通用占位图
UPDATE pms_product SET image = '/products/placeholder-product.svg' 
WHERE image LIKE '%unsplash%' AND image != '/products/placeholder-product.svg';

-- 更新内容封面
UPDATE cms_content SET cover = '/products/placeholder-content.svg' 
WHERE cover LIKE '%unsplash%';

-- 更新供应商 logo
UPDATE oms_supplier SET logo = '/products/placeholder-supplier.svg' 
WHERE logo LIKE '%unsplash%' OR logo IS NULL OR logo = '';

-- 验证更新结果
SELECT id, name, image FROM pms_product;
SELECT id, title, cover FROM cms_content;
SELECT id, name, logo FROM oms_supplier;
