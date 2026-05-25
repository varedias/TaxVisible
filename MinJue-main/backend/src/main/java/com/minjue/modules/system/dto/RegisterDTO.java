package com.minjue.modules.system.dto;

import lombok.Data;

/**
 * 注册请求 DTO
 */
@Data
public class RegisterDTO {

    /** 用户名 */
    private String username;

    /** 密码 */
    private String password;

    /** 确认密码 */
    private String confirmPassword;

    /** 邮箱 */
    private String email;

    /** 昵称 */
    private String nickname;

    /** 角色: USER, SUPPLIER */
    private String role;

    /** 图形验证码UUID */
    private String captchaUuid;

    /** 图形验证码 */
    private String captchaCode;

    /** 邮箱验证码 */
    private String emailCode;

    /** 手机号 */
    private String phone;
}
