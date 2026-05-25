package com.minjue.modules.admin.dto;

import lombok.Data;

@Data
public class AdminLoginDTO {
    /** 账号 */
    private String username;

    /** 密码 */
    private String password;

    /** 验证码UUID */
    private String captchaUuid;

    /** 验证码 */
    private String captchaCode;
}
