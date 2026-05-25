-- Sprint 6: 租赁全流程字段补齐
-- 执行时间: 2026-03-25

ALTER TABLE `oms_leasing`
  ADD COLUMN `warehouse_address` VARCHAR(255) NULL COMMENT '仓库/设备所在地' AFTER `supplier_id`,
  ADD COLUMN `inventory_status` TINYINT DEFAULT 0 COMMENT '库存状态: 0-待租, 1-已租出' AFTER `status`,
  ADD COLUMN `lessee_company` VARCHAR(100) NULL COMMENT '当前承租企业' AFTER `inventory_status`,
  ADD COLUMN `lessee_contact_name` VARCHAR(50) NULL COMMENT '当前联系人' AFTER `lessee_company`,
  ADD COLUMN `lessee_contact_phone` VARCHAR(20) NULL COMMENT '当前联系电话' AFTER `lessee_contact_name`,
  ADD COLUMN `delivery_address` VARCHAR(255) NULL COMMENT '配送地址' AFTER `lessee_contact_phone`,
  ADD COLUMN `onsite_address` VARCHAR(255) NULL COMMENT '使用地址' AFTER `delivery_address`,
  ADD COLUMN `lease_start_date` DATE NULL COMMENT '当前租赁开始日期' AFTER `onsite_address`,
  ADD COLUMN `expected_return_date` DATE NULL COMMENT '预计收回日期' AFTER `lease_start_date`,
  ADD COLUMN `current_lease_period` VARCHAR(20) NULL COMMENT '当前租赁周期' AFTER `expected_return_date`,
  ADD COLUMN `current_lease_duration` INT NULL COMMENT '当前租赁时长' AFTER `current_lease_period`,
  ADD COLUMN `current_rental_amount` DECIMAL(12,2) NULL COMMENT '当前租赁金额' AFTER `current_lease_duration`,
  ADD COLUMN `rental_remark` TEXT NULL COMMENT '当前租赁备注' AFTER `current_rental_amount`,
  ADD COLUMN `return_address` VARCHAR(255) NULL COMMENT '最近收回地址' AFTER `rental_remark`,
  ADD COLUMN `return_receiver_name` VARCHAR(50) NULL COMMENT '最近收回接收人' AFTER `return_address`,
  ADD COLUMN `equipment_condition` VARCHAR(100) NULL COMMENT '设备收回状态' AFTER `return_receiver_name`,
  ADD COLUMN `return_note` TEXT NULL COMMENT '收回备注' AFTER `equipment_condition`,
  ADD COLUMN `return_date` DATE NULL COMMENT '收回日期' AFTER `return_note`;

ALTER TABLE `oms_leasing_application`
  ADD COLUMN `delivery_address` VARCHAR(255) NULL COMMENT '配送地址' AFTER `contact_phone`,
  ADD COLUMN `onsite_address` VARCHAR(255) NULL COMMENT '使用地址' AFTER `delivery_address`,
  ADD COLUMN `expected_start_date` DATE NULL COMMENT '期望开始日期' AFTER `onsite_address`;
