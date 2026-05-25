-- ===========================================
-- 民崛平台 数据库初始化脚本
-- 包含: 表结构、用户数据、测试数据
-- ===========================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS minjue_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE minjue_db;

-- 1. 系统用户表
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '加密密码',
    nickname VARCHAR(50) COMMENT '昵称',
    email VARCHAR(100) COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    avatar VARCHAR(255) COMMENT '头像URL',
    role VARCHAR(20) DEFAULT 'USER' COMMENT '角色: USER-普通用户, SUPPLIER-供应商, ADMIN-管理员',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-正常, 0-禁用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表';

-- 2. 供应商表
CREATE TABLE IF NOT EXISTS oms_supplier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '供应商名称',
    logo VARCHAR(255) COMMENT 'Logo图片URL',
    description TEXT COMMENT '企业简介',
    contact_info VARCHAR(500) COMMENT '联系方式(JSON格式)',
    is_verified TINYINT DEFAULT 0 COMMENT '认证状态: 0-待审核, 1-已认证, 2-审核拒绝',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    user_id BIGINT COMMENT '关联用户ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='供应商表';

-- 3. 商品分类表
CREATE TABLE IF NOT EXISTS pms_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID, 0表示顶级分类',
    sort INT DEFAULT 0 COMMENT '排序值',
    icon VARCHAR(255) COMMENT '图标'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- 4. 商品表
CREATE TABLE IF NOT EXISTS pms_product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    name VARCHAR(200) NOT NULL COMMENT '商品名称',
    price DECIMAL(10, 2) NOT NULL COMMENT '价格',
    original_price DECIMAL(10, 2) COMMENT '原价',
    stock INT DEFAULT 0 COMMENT '库存',
    image VARCHAR(255) COMMENT '主图URL',
    album TEXT COMMENT '相册图片(JSON数组)',
    description TEXT COMMENT '商品描述',
    specs TEXT COMMENT '规格参数(JSON格式)',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-上架, 0-下架',
    sales INT DEFAULT 0 COMMENT '销量',
    views INT DEFAULT 0 COMMENT '浏览量',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 5. 订单表
CREATE TABLE IF NOT EXISTS oms_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    order_no VARCHAR(64) NOT NULL COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    total_amount DECIMAL(10, 2) NOT NULL COMMENT '订单总金额',
    status TINYINT DEFAULT 0 COMMENT '订单状态: 0-待付款, 1-待发货, 2-已发货, 3-已完成, 4-已取消',
    pay_time DATETIME COMMENT '支付时间',
    delivery_time DATETIME COMMENT '发货时间',
    finish_time DATETIME COMMENT '完成时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_order_no (order_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 6. 订单明细表
CREATE TABLE IF NOT EXISTS oms_order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    product_name VARCHAR(200) COMMENT '商品名称快照',
    product_image VARCHAR(255) COMMENT '商品图片快照',
    product_price DECIMAL(10, 2) COMMENT '商品价格快照',
    quantity INT DEFAULT 1 COMMENT '购买数量',
    subtotal DECIMAL(10, 2) COMMENT '小计金额',
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';

-- 7. 内容/发现表
CREATE TABLE IF NOT EXISTS cms_content (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    title_en VARCHAR(200) COMMENT '英文标题',
    type VARCHAR(20) COMMENT '类型: video-视频, article-文章, vlog-Vlog',
    cover VARCHAR(255) COMMENT '封面图URL',
    content_url TEXT COMMENT '内容URL或正文',
    author VARCHAR(50) COMMENT '作者',
    views INT DEFAULT 0 COMMENT '浏览量',
    category VARCHAR(50) COMMENT '分类: review-测评, tutorial-教程, vlog-Vlog, news-资讯',
    tags TEXT COMMENT '标签(JSON数组)',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-已发布, 0-草稿',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='内容发现表';

-- 8. 租赁设备表
CREATE TABLE IF NOT EXISTS oms_leasing (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(200) NOT NULL COMMENT '设备名称',
    type VARCHAR(20) NOT NULL COMMENT '租赁类型: financing-融资租赁, operating-经营租赁',
    image VARCHAR(255) COMMENT '设备图片URL',
    description TEXT COMMENT '设备描述',
    supplier VARCHAR(100) COMMENT '供应商名称',
    supplier_id BIGINT COMMENT '供应商ID',
    warehouse_address VARCHAR(255) COMMENT '仓库/设备所在地',
    monthly_price DECIMAL(10, 2) COMMENT '月租金',
    total_price DECIMAL(10, 2) COMMENT '设备总价(融资租赁)',
    duration VARCHAR(50) COMMENT '租期',
    daily_price DECIMAL(10, 2) COMMENT '日租金(经营租赁)',
    weekly_price DECIMAL(10, 2) COMMENT '周租金(经营租赁)',
    benefits TEXT COMMENT '服务优势(JSON数组)',
    tags TEXT COMMENT '标签(JSON数组)',
    leased INT DEFAULT 0 COMMENT '已租次数',
    rating DECIMAL(2, 1) DEFAULT 5.0 COMMENT '评分',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-上架, 0-下架',
    inventory_status TINYINT DEFAULT 0 COMMENT '库存状态: 0-待租, 1-已租出',
    lessee_company VARCHAR(100) COMMENT '当前承租企业',
    lessee_contact_name VARCHAR(50) COMMENT '当前联系人',
    lessee_contact_phone VARCHAR(20) COMMENT '当前联系电话',
    delivery_address VARCHAR(255) COMMENT '配送地址',
    onsite_address VARCHAR(255) COMMENT '使用地址',
    lease_start_date DATE COMMENT '当前租赁开始日期',
    expected_return_date DATE COMMENT '预计收回日期',
    current_lease_period VARCHAR(20) COMMENT '当前租赁周期',
    current_lease_duration INT COMMENT '当前租赁时长',
    current_rental_amount DECIMAL(12, 2) COMMENT '当前租赁金额',
    rental_remark TEXT COMMENT '当前租赁备注',
    return_address VARCHAR(255) COMMENT '最近收回地址',
    return_receiver_name VARCHAR(50) COMMENT '最近收回接收人',
    equipment_condition VARCHAR(100) COMMENT '设备收回状态',
    return_note TEXT COMMENT '收回备注',
    return_date DATE COMMENT '收回日期',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='租赁设备表';

-- 9. 租赁申请表
CREATE TABLE IF NOT EXISTS oms_leasing_application (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    leasing_id BIGINT NOT NULL COMMENT '租赁设备ID',
    user_id BIGINT NOT NULL COMMENT '申请用户ID',
    lease_type VARCHAR(20) COMMENT '租赁类型: FINANCIAL/OPERATING',
    lease_period VARCHAR(20) COMMENT '租赁周期: DAY/WEEK/MONTH',
    lease_duration INT COMMENT '租赁时长',
    estimated_cost DECIMAL(12, 2) COMMENT '预估费用',
    company_name VARCHAR(100) COMMENT '企业名称',
    contact_name VARCHAR(50) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    delivery_address VARCHAR(255) COMMENT '配送地址',
    onsite_address VARCHAR(255) COMMENT '使用地址',
    expected_start_date DATE COMMENT '期望开始日期',
    remark TEXT COMMENT '备注',
    status TINYINT DEFAULT 0 COMMENT '状态: 0-待审核, 1-已通过, 2-已驳回',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='租赁申请表';

-- ===========================================
-- 初始用户数据
-- ===========================================

-- 管理员账号 (密码: 123456)
INSERT INTO sys_user (username, password, nickname, email, phone, role, status) VALUES 
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '系统管理员', 'admin@minjue.com', '13800000001', 'ADMIN', 1);

-- 供应商测试账号 (密码: 123456)
INSERT INTO sys_user (username, password, nickname, email, phone, role, status) VALUES 
('supplier1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '懂视帝科技', 'supplier1@minjue.com', '13800000002', 'SUPPLIER', 1),
('supplier2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '精准视觉', 'supplier2@minjue.com', '13800000003', 'SUPPLIER', 1),
('supplier3', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '光源智能', 'supplier3@minjue.com', '13800000004', 'SUPPLIER', 1);

-- 普通用户测试账号 (密码: 123456)
INSERT INTO sys_user (username, password, nickname, email, phone, role, status) VALUES 
('user1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '张三', 'user1@test.com', '13900000001', 'USER', 1),
('user2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '李四', 'user2@test.com', '13900000002', 'USER', 1),
('user3', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '王五', 'user3@test.com', '13900000003', 'USER', 1),
('user4', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '赵六', 'user4@test.com', '13900000004', 'USER', 0),
('buyer', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '采购方测试', 'buyer@test.com', '13900000005', 'USER', 1);

-- ===========================================
-- 供应商数据
-- ===========================================
INSERT INTO oms_supplier (id, name, logo, description, contact_info, is_verified, user_id) VALUES
(1, '民崛智能科技有限公司', 'https://ui-avatars.com/api/?name=MJ&background=6366F1&color=fff', 
   '专注于模具行业智能化解决方案，提供模具视觉监测、缺陷检测等智能装备。', 
   '{"name":"张经理","phone":"400-888-0001","email":"info@min-jue.com","address":"浙江省宁波市"}', 1, NULL),

(2, '懂视帝智能科技有限公司', 'https://ui-avatars.com/api/?name=DSD&background=0D8ABC&color=fff', 
   '国内领先的AI视觉检测设备制造商，拥有自主研发的深度学习算法平台，产品广泛应用于电子、汽车、医药等行业。', 
   '{"name":"李总","phone":"400-888-0002","email":"contact@dongshidi.com","address":"深圳市南山区科技园"}', 1, 2),

(3, '杭州精准视觉设备有限公司', 'https://ui-avatars.com/api/?name=JZ&background=22C55E&color=fff', 
   '专业工业相机及视觉系统集成商，代理多个国际知名品牌，提供完整的机器视觉解决方案。', 
   '{"name":"王工","phone":"400-888-0003","email":"sales@jzvision.com","address":"杭州市滨江区"}', 1, 3),

(4, '上海光源智能装备有限公司', 'https://ui-avatars.com/api/?name=GY&background=F59E0B&color=fff', 
   '专业研发生产机器视觉LED光源，提供定制化光源解决方案，服务于半导体、电子、汽车等行业。', 
   '{"name":"陈经理","phone":"400-888-0004","email":"info@gylight.com","address":"上海市浦东新区"}', 1, 4),

(5, '北京博视自动化技术有限公司', 'https://ui-avatars.com/api/?name=BS&background=EF4444&color=fff', 
   '资深自动化系统集成商，服务于航空航天、军工等高端制造领域，提供工业机器人及自动化产线解决方案。', 
   '{"name":"刘总","phone":"400-888-0005","email":"service@boshi-auto.com","address":"北京市海淀区中关村"}', 1, NULL),

(6, '牧河自动化设备有限公司', 'https://ui-avatars.com/api/?name=MH&background=10B981&color=fff', 
   '专业自动化上料设备制造商，产品广泛应用于电子、塑料、五金等行业。', 
   '{"name":"赵工","phone":"400-888-0006","email":"contact@muhe-auto.com","address":"江苏省苏州市工业园区"}', 1, NULL),

(7, '深圳视觉先锋科技', 'https://ui-avatars.com/api/?name=SJ&background=8B5CF6&color=fff', 
   '新锐AI视觉检测企业，专注于3D视觉和深度学习技术研发。', 
   '{"name":"周经理","phone":"400-888-0007","email":"info@visionpioneer.com","address":"深圳市宝安区"}', 0, NULL),

(8, '苏州智造装备有限公司', 'https://ui-avatars.com/api/?name=ZZ&background=EC4899&color=fff', 
   '智能制造装备供应商，提供自动化产线设计与集成服务。', 
   '{"name":"吴总","phone":"400-888-0008","email":"sales@szzz.com","address":"苏州市吴中区"}', 2, NULL);

-- ===========================================
-- 商品分类数据
-- ===========================================
INSERT INTO pms_category (id, name, parent_id, sort, icon) VALUES
(1, 'AI视觉检测', 0, 1, 'eye'),
(2, '自动化设备', 0, 2, 'settings'),
(3, '工业相机', 0, 3, 'camera'),
(4, '光源镜头', 0, 4, 'sun'),
(5, '测量仪器', 0, 5, 'ruler'),
(6, '工业机器人', 0, 6, 'robot');


-- ===========================================
-- 商品数据 (更多假数据)
-- ===========================================
INSERT INTO pms_product (id, supplier_id, category_id, name, price, original_price, stock, image, description, specs, status, sales, views) VALUES
-- 懂视帝产品
(1, 2, 1, '懂视帝AI视觉检测系统 DSD-2000', 28900.00, 35000.00, 100, '/products/minjue-product-1.png', 
   '2D+3D双模式检测，深度学习算法，0.1mm精度，适用于电子、汽车、医药等行业质检', 
   '["2D+3D双模式","深度学习算法","0.1mm精度","支持多种接口"]', 1, 1245, 15600),

(2, 2, 1, '懂视帝智能缺陷检测仪 DSD-QC3000', 42000.00, 50000.00, 50, '/products/minjue-product-2.png', 
   '采用深度学习算法，精准识别产品表面缺陷，检测精度高达99.5%', 
   '["深度学习","高精度检测","多种缺陷识别","自动分类"]', 1, 856, 12500),

(3, 2, 1, '懂视帝3D视觉传感器 DSD-3D100', 15800.00, 18900.00, 80, '/products/minjue-product-3.png', 
   '激光三角测量原理，微米级精度，IP67防护等级，适用于各种工业环境', 
   '["激光三角测量","微米级精度","IP67防护","即插即用"]', 1, 867, 13400),

-- 民崛产品
(4, 1, 1, '民崛智能模具视觉监测装置 MJ-VIS-A8', 35800.00, 42000.00, 60, '/products/1-parameter.jpg', 
   '专业模具视觉监测系统，实时监控模具状态，AI智能识别异常，适用于注塑、压铸等行业', 
   '["高清工业相机","智能算法","实时监控","异常报警"]', 1, 645, 9800),

(5, 1, 1, '民崛智能模具保护监视器 MJ-MP-PRO', 28900.00, 35000.00, 80, '/products/2-parameter.jpg', 
   '实时监控模具运行状态，自动检测异常，防止模具损坏，降低生产成本', 
   '["模具保护","实时检测","自动报警","数据记录"]', 1, 1023, 15800),

-- 工业相机
(6, 3, 3, 'Basler ace系列工业相机套装', 4299.00, 5200.00, 500, '/products/3-parameter.jpg', 
   '200万像素，GigE接口，含镜头，适合各类视觉检测应用', 
   '["200万像素","GigE接口","含镜头","高帧率"]', 1, 2234, 28900),

(7, 3, 3, '大华智能相机 DH-IPC-AI', 6800.00, 8200.00, 200, '/products/minjue-product-1.png', 
   'AI算法内置，边缘计算，即插即用，适合智能制造场景', 
   '["AI算法内置","边缘计算","即插即用","多协议支持"]', 1, 1567, 18900),

(8, 3, 3, '海康机器MV-CA050-10GM', 3500.00, 4200.00, 300, '/products/minjue-product-2.png', 
   '500万像素，全局快门，GigE接口，工业级设计', 
   '["500万像素","全局快门","GigE接口","工业级"]', 1, 1890, 22000),

-- 光源镜头
(9, 4, 4, 'CCS LED环形光源 LDR2-100', 680.00, 850.00, 1000, '/products/minjue-product-3.png', 
   '高亮度LED光源，可调光，多种规格可选，适合各类视觉检测', 
   '["高亮度","可调光","多种规格","长寿命"]', 1, 5678, 45200),

(10, 4, 4, '富士能工业镜头 16mm定焦', 1280.00, 1580.00, 600, '/products/1-parameter.jpg', 
   'C口，低畸变，高分辨率，日本原装进口', 
   '["C口","低畸变","高分辨率","日本进口"]', 1, 3456, 28900),

(11, 4, 4, '远心镜头 50mm', 1200.00, 1500.00, 300, '/products/2-parameter.jpg', 
   '支持2/3英寸靶面，C接口，低畸变设计', 
   '["低畸变","高分辨率","C接口","远心设计"]', 1, 890, 11200),

-- 测量仪器
(12, 5, 5, '基恩士激光位移传感器 LK-G5000', 15800.00, 18500.00, 30, '/products/3-parameter.jpg', 
   '微米级精度，抗干扰强，稳定可靠，适用于精密测量', 
   '["微米级精度","抗干扰强","稳定可靠","多种输出"]', 1, 567, 8900),

(13, 5, 5, '蔡司三坐标测量机 CONTURA', 350000.00, 420000.00, 5, '/products/minjue-product-1.png', 
   '德国进口，高精度三坐标测量，自动化测量，软件强大', 
   '["高精度","自动化","软件强大","德国进口"]', 1, 45, 5600),

(14, 5, 5, '二次元影像测量仪', 28000.00, 32000.00, 40, '/products/minjue-product-2.png', 
   '手动+自动测量，CCD相机，专业测量软件', 
   '["手动+自动","CCD相机","测量软件","高性价比"]', 1, 678, 11200),

-- 工业机器人
(15, 5, 6, 'ABB IRB 1200工业机器人', 85000.00, 95000.00, 20, '/products/minjue-product-3.png', 
   '6轴机器人，负载7kg，适用于装配和物料搬运', 
   '["6轴","负载7kg","高速","紧凑型"]', 1, 234, 8900),

(16, 5, 6, '爱普生SCARA机器人 T3', 38000.00, 45000.00, 35, '/products/1-parameter.jpg', 
   '4轴SCARA机器人，高速精准，易集成', 
   '["4轴","高速精准","易集成","日本品牌"]', 1, 456, 9800),

(17, 6, 2, '牧河自动化上料机 MH-FL-200', 18900.00, 22000.00, 200, '/products/2-parameter.jpg', 
   '全自动上料系统，适用于各类生产线，提升生产效率', 
   '["自动上料","高效稳定","多规格适配","易维护"]', 1, 1234, 18500),

-- 更多AI视觉产品
(18, 2, 1, '懂视帝AOI检测系统 DSD-AOI500', 68000.00, 80000.00, 25, '/products/3-parameter.jpg', 
   'PCB板AOI检测，双面检测，AI算法，适合电子制造', 
   '["双面检测","AI算法","高速检测","缺陷分类"]', 1, 234, 6500),

(19, 2, 1, '懂视帝智能分拣系统 DSD-SORT100', 125000.00, 150000.00, 10, '/products/minjue-product-1.png', 
   '基于深度学习的智能分拣系统，支持多品类识别', 
   '["深度学习","多品类识别","高速分拣","柔性部署"]', 1, 89, 4500),

-- 下架商品示例
(20, 3, 3, '停产型号工业相机 OLD-100', 2500.00, 3000.00, 0, '/products/minjue-product-2.png', 
   '此型号已停产，仅供参考', 
   '["已停产"]', 0, 500, 8000),

(21, 4, 4, '旧款LED光源 OLD-LED', 300.00, 400.00, 0, '/products/minjue-product-3.png', 
   '旧款产品，已下架', 
   '["已下架"]', 0, 200, 3000);


-- ===========================================
-- 租赁设备数据
-- ===========================================

-- 融资租赁设备
INSERT INTO oms_leasing (name, type, image, description, supplier, supplier_id, monthly_price, total_price, duration, benefits, tags, leased, rating, status) VALUES
('懂视帝AI视觉检测系统 DSD-2000', 'financing', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', 
 '适合企业长期使用，租期结束后设备归您所有', '懂视帝智能科技', 2, 2800.00, 280000.00, '36个月',
 '["设备所有权转移","税收优惠","固定资产管理"]', '["AI检测","设备所有权转移"]', 156, 4.9, 1),

('Basler ace系列工业相机套装', 'financing', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
 '200万像素，含镜头，适合生产线长期使用', '杭州精准视觉', 3, 380.00, 38000.00, '24个月',
 '["分期付款","减轻资金压力","设备归属权"]', '["工业相机","长期租赁"]', 234, 4.8, 1),

('ABB IRB 1200工业机器人', 'financing', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
 '6轴机器人，负载7kg，适合自动化生产线', '北京博视自动化', 5, 7200.00, 850000.00, '48个月',
 '["设备升级选择","维护服务包含","产权转移"]', '["工业机器人","融资租赁"]', 89, 5.0, 1),

('三坐标测量机 高精度版', 'financing', 'https://images.unsplash.com/photo-1581093458791-9d58b3fbbd0d?w=400',
 '高精度三坐标测量，适合质检部门长期配置', '北京博视自动化', 5, 15000.00, 1800000.00, '48个月',
 '["技术升级服务","培训支持","设备所有权"]', '["精密测量","高端设备"]', 45, 4.9, 1),

('懂视帝AOI检测系统 DSD-AOI500', 'financing', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
 'PCB板AOI检测，双面检测，AI算法', '懂视帝智能科技', 2, 5500.00, 680000.00, '48个月',
 '["软件更新免费","远程技术支持","产权归属"]', '["AOI检测","电子制造"]', 67, 4.8, 1),

('激光切割机 6000W', 'financing', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
 '6000W光纤激光，切割厚度20mm，适合金属加工', '牧河自动化', 6, 18000.00, 2200000.00, '60个月',
 '["设备保险包含","备件优先供应","产权转移"]', '["激光切割","高功率"]', 34, 4.9, 1);

-- 经营租赁设备
INSERT INTO oms_leasing (name, type, image, description, supplier, supplier_id, daily_price, weekly_price, monthly_price, benefits, tags, leased, rating, status) VALUES
('懂视帝便携式AI检测系统', 'operating', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
 '适合项目型需求，随租随用，无需长期投入', '懂视帝智能科技', 2, 200.00, 1200.00, 4000.00,
 '["按需租赁","即租即用","无设备折旧"]', '["短期租赁","灵活使用"]', 456, 4.7, 1),

('工业内窥镜检测设备', 'operating', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400',
 '适合临时检测项目，设备维护由出租方负责', '上海光源智能', 4, 150.00, 900.00, 3000.00,
 '["设备维护免费","技术指导","灵活退租"]', '["内窥检测","租期灵活"]', 567, 4.6, 1),

('红外热成像相机专业版', 'operating', 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400',
 '适合短期热成像检测项目，高精度测温', '北京博视自动化', 5, 300.00, 1800.00, 6000.00,
 '["专业培训","技术支持","即用即还"]', '["热成像","专业设备"]', 234, 4.8, 1),

('3D扫描仪便携款', 'operating', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
 '适合逆向工程项目，随用随租', '杭州精准视觉', 3, 250.00, 1500.00, 5000.00,
 '["软件授权包含","数据处理支持","灵活租期"]', '["3D扫描","便携设备"]', 345, 4.7, 1),

('超声波探伤仪', 'operating', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
 '适合焊缝检测项目，按天计费更经济', '北京博视自动化', 5, 180.00, 1000.00, 3500.00,
 '["检测报告协助","技术培训","押金可退"]', '["无损检测","短租"]', 456, 4.6, 1),

('便携式光谱分析仪', 'operating', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
 '材料成分分析，适合临时检测需求', '上海光源智能', 4, 400.00, 2400.00, 8000.00,
 '["校准证书","专家指导","快速交付"]', '["光谱分析","高端租赁"]', 123, 4.9, 1),

-- 下架的租赁设备
('旧款检测设备(已下架)', 'operating', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
 '此设备已下架，不再提供租赁服务', '懂视帝智能科技', 2, 100.00, 600.00, 2000.00,
 '["已下架"]', '["已下架"]', 50, 4.0, 0);

-- ===========================================
-- 内容/发现数据
-- ===========================================
INSERT INTO cms_content (id, title, title_en, type, cover, author, views, category, tags, status) VALUES
(1, '懂视帝AI视觉检测系统深度测评', 'DongShiDi AI Vision Inspection System In-depth Review', 
   'video', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600', 
   '工业视觉达人', 125600, 'review', '["AI检测","懂视帝","测评"]', 1),

(2, '基恩士vs康耐视 | 3D视觉传感器横评', 'Keyence vs Cognex | 3D Vision Sensor Comparison', 
   'video', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600', 
   '智能制造观察', 89200, 'review', '["基恩士","康耐视","3D视觉"]', 1),

(3, '如何选择工业相机？5个关键参数详解', 'How to Choose Industrial Cameras? 5 Key Parameters', 
   'article', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600', 
   '机器视觉专家', 8500, 'tutorial', '["工业相机","选购指南"]', 1),

(4, '探厂实拍 | 走进懂视帝AI视觉检测设备制造商', 'Factory Tour | Inside DongShiDi AI Vision Equipment Manufacturer', 
   'vlog', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600', 
   '工业探厂Vlog', 234000, 'vlog', '["探厂","深圳","制造业"]', 1),

(5, '2024年工业视觉行业趋势分析', '2024 Industrial Vision Industry Trend Analysis', 
   'article', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600', 
   '行业分析师', 56000, 'news', '["行业趋势","2024","视觉检测"]', 1),

(6, '机器视觉光源选型指南', 'Machine Vision Light Source Selection Guide', 
   'article', 'https://images.unsplash.com/photo-1581093458791-9d58b3fbbd0d?w=600', 
   '光源专家', 32000, 'tutorial', '["光源","选型","教程"]', 1);


-- ===========================================
-- 9. 商品评论表
-- ===========================================
CREATE TABLE IF NOT EXISTS pms_comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    user_name VARCHAR(50) COMMENT '用户名',
    user_avatar VARCHAR(255) COMMENT '用户头像',
    rating TINYINT DEFAULT 5 COMMENT '评分: 1-5星',
    content TEXT COMMENT '评论内容',
    images TEXT COMMENT '评论图片(JSON数组)',
    helpful INT DEFAULT 0 COMMENT '有用数',
    status TINYINT DEFAULT 1 COMMENT '状态: 1-显示, 0-隐藏',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评论表';

-- ===========================================
-- 10. 用户点赞表
-- ===========================================
CREATE TABLE IF NOT EXISTS ums_like (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_type VARCHAR(20) NOT NULL COMMENT '目标类型: product-商品, comment-评论, content-内容',
    target_id BIGINT NOT NULL COMMENT '目标ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_user_target (user_id, target_type, target_id),
    INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户点赞表';

-- ===========================================
-- 11. 用户收藏表
-- ===========================================
CREATE TABLE IF NOT EXISTS ums_favorite (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_type VARCHAR(20) NOT NULL COMMENT '目标类型: product-商品, supplier-供应商, content-内容',
    target_id BIGINT NOT NULL COMMENT '目标ID',
    target_name VARCHAR(200) COMMENT '目标名称(冗余)',
    target_image VARCHAR(255) COMMENT '目标图片(冗余)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_user_target (user_id, target_type, target_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户收藏表';

-- ===========================================
-- 12. 分享记录表
-- ===========================================
CREATE TABLE IF NOT EXISTS ums_share (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT COMMENT '用户ID(可为空,未登录用户)',
    target_type VARCHAR(20) NOT NULL COMMENT '目标类型: product-商品, supplier-供应商, content-内容',
    target_id BIGINT NOT NULL COMMENT '目标ID',
    target_name VARCHAR(200) COMMENT '目标名称',
    share_url VARCHAR(500) COMMENT '分享链接',
    platform VARCHAR(20) COMMENT '分享平台: copy-复制链接, wechat-微信, weibo-微博',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分享记录表';

-- ===========================================
-- 订单测试数据
-- ===========================================
INSERT INTO oms_order (order_no, user_id, total_amount, status, pay_time, create_time) VALUES
('202601290001', 4, 89800.00, 3, '2026-01-20 10:30:00', '2026-01-20 10:00:00'),
('202601290002', 5, 45600.00, 2, '2026-01-22 14:20:00', '2026-01-22 14:00:00'),
('202601290003', 6, 128000.00, 1, '2026-01-25 09:15:00', '2026-01-25 09:00:00'),
('202601290004', 4, 35800.00, 0, NULL, '2026-01-28 16:30:00'),
('202601290005', 7, 68500.00, 4, NULL, '2026-01-27 11:00:00'),
('202601290006', 5, 156000.00, 3, '2026-01-15 08:45:00', '2026-01-15 08:30:00'),
('202601290007', 6, 42000.00, 2, '2026-01-26 15:00:00', '2026-01-26 14:30:00'),
('202601290008', 4, 98500.00, 1, '2026-01-29 10:00:00', '2026-01-29 09:30:00');

-- 订单明细测试数据
INSERT INTO oms_order_item (order_id, product_id, product_name, product_image, product_price, quantity, subtotal) VALUES
(1, 1, '懂视帝AI视觉检测系统 DSD-2000', '/products/minjue-product-1.png', 89800.00, 1, 89800.00),
(2, 2, '懂视帝智能缺陷检测仪 DSD-QC3000', '/products/minjue-product-2.png', 45600.00, 1, 45600.00),
(3, 3, '懂视帝高速视觉分拣系统 DSD-Sort500', '/products/minjue-product-3.png', 128000.00, 1, 128000.00),
(4, 4, '康耐视In-Sight 2000系列视觉传感器', '/products/1-parameter.jpg', 35800.00, 1, 35800.00),
(5, 5, '基恩士CV-X系列图像传感器', '/products/2-parameter.jpg', 68500.00, 1, 68500.00),
(6, 1, '懂视帝AI视觉检测系统 DSD-2000', '/products/minjue-product-1.png', 89800.00, 1, 89800.00),
(6, 2, '懂视帝智能缺陷检测仪 DSD-QC3000', '/products/minjue-product-2.png', 66200.00, 1, 66200.00),
(7, 6, 'Basler ace系列工业相机套装', '/products/3-parameter.jpg', 42000.00, 1, 42000.00),
(8, 1, '懂视帝AI视觉检测系统 DSD-2000', '/products/minjue-product-1.png', 89800.00, 1, 89800.00),
(8, 4, '康耐视In-Sight 2000系列视觉传感器', '/products/1-parameter.jpg', 8700.00, 1, 8700.00);

-- ===========================================
-- 评论测试数据
-- ===========================================
INSERT INTO pms_comment (product_id, user_id, user_name, user_avatar, rating, content, helpful, status) VALUES
(1, 4, '张先生', 'https://ui-avatars.com/api/?name=ZS&background=random', 5, '设备非常好用，精度高，检测速度快，售后服务也很到位。已经用了3个月，运行稳定，推荐购买！', 234, 1),
(1, 5, '李工', 'https://ui-avatars.com/api/?name=LG&background=random', 5, '公司采购了多台，效果非常好。技术支持响应很快，解决问题很专业。', 189, 1),
(1, 6, '王经理', 'https://ui-avatars.com/api/?name=WJL&background=random', 4, '总体不错，性价比很高。操作简单，功能实用。', 156, 1),
(2, 4, '张先生', 'https://ui-avatars.com/api/?name=ZS&background=random', 5, '缺陷检测准确率很高，大大提升了我们的质检效率。', 145, 1),
(2, 7, '赵六', 'https://ui-avatars.com/api/?name=ZL&background=random', 5, '深度学习算法确实强大，各种缺陷都能识别出来。', 98, 1),
(3, 5, '李工', 'https://ui-avatars.com/api/?name=LG&background=random', 5, '3D视觉传感器精度很高，满足我们的测量需求。', 87, 1),
(4, 6, '王经理', 'https://ui-avatars.com/api/?name=WJL&background=random', 5, '模具监测系统很实用，帮我们避免了很多模具损坏。', 123, 1),
(5, 4, '张先生', 'https://ui-avatars.com/api/?name=ZS&background=random', 4, '模具保护器效果不错，性价比高。', 67, 1),
(6, 7, '赵六', 'https://ui-avatars.com/api/?name=ZL&background=random', 5, 'Basler相机画质清晰，帧率稳定，很满意。', 234, 1),
(6, 5, '李工', 'https://ui-avatars.com/api/?name=LG&background=random', 5, '工业相机性能稳定，已经用了半年没出过问题。', 178, 1);

-- ===========================================
-- 点赞测试数据
-- ===========================================
INSERT INTO ums_like (user_id, target_type, target_id) VALUES
(4, 'product', 1), (4, 'product', 2), (4, 'product', 6),
(5, 'product', 1), (5, 'product', 3), (5, 'product', 4),
(6, 'product', 2), (6, 'product', 5), (6, 'product', 6),
(7, 'product', 1), (7, 'product', 2), (7, 'product', 3),
(4, 'comment', 1), (5, 'comment', 1), (6, 'comment', 2),
(4, 'content', 1), (5, 'content', 1), (6, 'content', 2);

-- ===========================================
-- 收藏测试数据
-- ===========================================
INSERT INTO ums_favorite (user_id, target_type, target_id, target_name, target_image) VALUES
(4, 'product', 1, '懂视帝AI视觉检测系统 DSD-2000', '/products/minjue-product-1.png'),
(4, 'product', 6, 'Basler ace系列工业相机套装', '/products/3-parameter.jpg'),
(5, 'product', 2, '懂视帝智能缺陷检测仪 DSD-QC3000', '/products/minjue-product-2.png'),
(5, 'product', 4, '民崛智能模具视觉监测装置 MJ-VIS-A8', '/products/1-parameter.jpg'),
(6, 'product', 1, '懂视帝AI视觉检测系统 DSD-2000', '/products/minjue-product-1.png'),
(6, 'supplier', 2, '懂视帝智能科技有限公司', 'https://ui-avatars.com/api/?name=DSD&background=0D8ABC&color=fff'),
(7, 'product', 3, '懂视帝3D视觉传感器 DSD-3D100', '/products/minjue-product-3.png'),
(7, 'content', 1, '懂视帝AI视觉检测系统深度测评', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600');

-- ===========================================
-- 分享记录测试数据
-- ===========================================
INSERT INTO ums_share (user_id, target_type, target_id, target_name, share_url, platform) VALUES
(4, 'product', 1, '懂视帝AI视觉检测系统 DSD-2000', '/product/1', 'copy'),
(5, 'product', 2, '懂视帝智能缺陷检测仪 DSD-QC3000', '/product/2', 'wechat'),
(6, 'product', 6, 'Basler ace系列工业相机套装', '/product/6', 'copy'),
(NULL, 'product', 1, '懂视帝AI视觉检测系统 DSD-2000', '/product/1', 'copy'),
(NULL, 'product', 3, '懂视帝3D视觉传感器 DSD-3D100', '/product/3', 'weibo'),
(4, 'content', 1, '懂视帝AI视觉检测系统深度测评', '/content/1', 'wechat');

-- ===========================================
-- 补丁：确保 oms_order.update_time 字段存在
-- ===========================================
-- 兼容低版本 MySQL：动态判断是否已存在 update_time 列
SET @col_exists := (
   SELECT COUNT(*) FROM information_schema.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'oms_order'
     AND COLUMN_NAME = 'update_time'
);

SET @add_col_sql := IF(@col_exists = 0,
   'ALTER TABLE oms_order ADD COLUMN update_time DATETIME NULL COMMENT ''更新时间'';',
   'SELECT 1;'
);

PREPARE stmt FROM @add_col_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE oms_order SET update_time = create_time WHERE update_time IS NULL;
