-- 修复图片：将无法访问的 Unsplash 图片替换为本地占位图
-- 执行: mysql -u root -p123456 minjue_db < fix_images.sql

-- 更新产品图片
UPDATE pms_product SET image = '/products/placeholder-product.svg' WHERE image LIKE '%unsplash%';

-- 更新内容封面
UPDATE cms_content SET cover = '/products/placeholder-content.svg' WHERE cover LIKE '%unsplash%';

-- 更新供应商 logo
UPDATE oms_supplier SET logo = '/products/placeholder-supplier.svg' WHERE logo LIKE '%unsplash%' OR logo IS NULL;
