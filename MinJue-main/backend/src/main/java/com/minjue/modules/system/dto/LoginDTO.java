package com.minjue.modules.system.dto;

import lombok.Data;

/**
 * 登录请求 DTO
 */
@Data
public class LoginDTO {

    /** 用户名 */
    private String username;

    /** 密码 */
    private String password;

    /** 验证码UUID */
    private String captchaUuid;

    /** 验证码 */
    private String captchaCode;

    /** 登录身份角色 (supplier/buyer) */
    private String role;
}
