-- Sprint 5: 新增采购需求表和租赁申请表
-- 执行时间: 2026-02-08

-- 采购需求表
CREATE TABLE IF NOT EXISTS `pms_procurement` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL COMMENT '采购标题',
  `description` TEXT COMMENT '采购描述',
  `category_id` BIGINT COMMENT '设备分类',
  `budget_min` DECIMAL(12,2) COMMENT '预算下限',
  `budget_max` DECIMAL(12,2) COMMENT '预算上限',
  `quantity` INT COMMENT '需求数量',
  `deadline` DATE COMMENT '截止日期',
  `contact_name` VARCHAR(50) COMMENT '联系人',
  `contact_phone` VARCHAR(20) COMMENT '联系电话',
  `user_id` BIGINT NOT NULL COMMENT '发布用户',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1-进行中 2-已完成 3-已关闭',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='采购需求';

-- 租赁申请表
CREATE TABLE IF NOT EXISTS `oms_leasing_application` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `leasing_id` BIGINT NOT NULL COMMENT '租赁设备ID',
  `user_id` BIGINT NOT NULL COMMENT '申请用户ID',
  `lease_type` VARCHAR(20) COMMENT '租赁类型: FINANCIAL/OPERATING',
  `lease_period` VARCHAR(20) COMMENT '租赁周期: DAY/WEEK/MONTH',
  `lease_duration` INT COMMENT '租赁时长',
  `estimated_cost` DECIMAL(12,2) COMMENT '预估费用',
  `company_name` VARCHAR(100) COMMENT '企业名称',
  `contact_name` VARCHAR(50) COMMENT '联系人',
  `contact_phone` VARCHAR(20) COMMENT '联系电话',
  `delivery_address` VARCHAR(255) COMMENT '配送地址',
  `onsite_address` VARCHAR(255) COMMENT '使用地址',
  `expected_start_date` DATE COMMENT '期望开始日期',
  `remark` TEXT COMMENT '备注',
  `status` TINYINT DEFAULT 0 COMMENT '状态: 0-待审核 1-已通过 2-已驳回',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_leasing_id` (`leasing_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='租赁申请';

-- 插入采购需求示例数据
INSERT INTO `pms_procurement` (`title`, `description`, `category_id`, `budget_min`, `budget_max`, `quantity`, `deadline`, `contact_name`, `contact_phone`, `user_id`, `status`) VALUES
('急需工业视觉检测设备', '需要采购一批高精度视觉检测设备，用于电子元器件质检产线，要求检测精度≤0.01mm', 1, 50000.00, 200000.00, 5, '2026-03-15', '张工', '138****1234', 1, 1),
('采购二手数控机床', '因产线扩建，需要采购3台二手数控机床，品牌不限，精度达标即可', 2, 80000.00, 150000.00, 3, '2026-03-01', '李经理', '139****5678', 1, 1),
('智能仓储AGV小车采购', 'AGV搬运机器人采购，用于工厂内部物流运输，需支持自动充电和路径规划', 3, 200000.00, 500000.00, 10, '2026-04-01', '王主任', '136****9012', 1, 1),
('自动化焊接机器人', '需要6轴工业焊接机器人，适用于汽车零部件焊接，含编程调试服务', 4, 300000.00, 800000.00, 2, '2026-03-20', '赵总', '135****3456', 1, 1),
('3D打印设备租赁或购买', '用于产品原型快速打印，金属和塑料材质均可，优先考虑租赁方案', 5, 100000.00, 300000.00, 1, '2026-02-28', '陈工', '137****7890', 1, 1),
('工业激光切割机', '需要大功率激光切割设备，切割厚度≥20mm碳钢板，含安装调试', 6, 400000.00, 1000000.00, 1, '2026-04-15', '刘经理', '133****2345', 1, 1);
