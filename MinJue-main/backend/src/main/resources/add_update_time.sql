-- 为 oms_order 表添加 update_time 字段
-- 执行此脚本修复订单管理报错

ALTER TABLE oms_order ADD COLUMN update_time DATETIME COMMENT '更新时间';

-- 更新现有数据的 update_time 为 create_time
UPDATE oms_order SET update_time = create_time WHERE update_time IS NULL;
