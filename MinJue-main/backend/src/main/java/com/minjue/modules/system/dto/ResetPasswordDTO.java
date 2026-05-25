package com.minjue.modules.system.dto;

import lombok.Data;

/**
 * 重置密码请求DTO
 */
@Data
public class ResetPasswordDTO {

    private String username;

    private String email;

    private String emailCode;

    private String newPassword;

    private String confirmPassword;

    private String captchaUuid;

    private String captchaCode;
}
