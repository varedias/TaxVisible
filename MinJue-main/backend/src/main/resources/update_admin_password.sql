-- ===========================================
-- 更新管理员密码脚本
-- 密码: 123456
-- BCrypt哈希: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH
-- ===========================================

USE minjue_db;

-- 更新admin用户密码和状态
UPDATE sys_user 
SET password = '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH',
    status = 1
WHERE username = 'admin';

-- 如果admin用户不存在则插入
INSERT INTO sys_user (username, password, nickname, role, status)
SELECT 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '系统管理员', 'ADMIN', 1
WHERE NOT EXISTS (SELECT 1 FROM sys_user WHERE username = 'admin');

-- 验证结果
SELECT id, username, nickname, role, status FROM sys_user WHERE username = 'admin';
