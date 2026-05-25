package com.minjue.modules.admin.dto;

import lombok.Data;

/**
 * 用户状态更新参数
 */
@Data
public class UserStatusDTO {
    
    /** 状态: 0-封禁, 1-解封 */
    private Integer status;
}
