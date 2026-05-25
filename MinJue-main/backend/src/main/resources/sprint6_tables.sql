-- Sprint 6: IM 消息表
CREATE TABLE IF NOT EXISTS `oms_message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sender_id` bigint NOT NULL COMMENT '发送者用户ID',
  `receiver_id` bigint DEFAULT NULL COMMENT '接收者用户ID（供应商关联的用户ID）',
  `supplier_id` bigint NOT NULL COMMENT '供应商ID',
  `content` text NOT NULL COMMENT '消息内容',
  `message_type` varchar(20) NOT NULL DEFAULT 'TEXT' COMMENT '消息类型: TEXT/IMAGE/FILE',
  `is_from_supplier` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否来自供应商',
  `is_read` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否已读',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sender` (`sender_id`),
  KEY `idx_supplier` (`supplier_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='即时消息表';
