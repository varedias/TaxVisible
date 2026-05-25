package com.minjue.modules.system.controller;

import com.minjue.common.result.Result;
import com.minjue.modules.system.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 邮箱验证码控制器
 */
@Tag(name = "Email")
@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @Operation(summary = "发送邮箱验证码")
    @PostMapping("/send")
    public Result<String> sendVerificationCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String type = request.getOrDefault("type", "register");

        if (email == null || email.isBlank()) {
            return Result.error(400, "邮箱地址不能为空");
        }

        // 简单的邮箱格式校验
        if (!email.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
            return Result.error(400, "邮箱格式不正确");
        }

        boolean success = emailService.sendVerificationCode(email, type);

        if (success) {
            return Result.success("验证码已发送，请查收邮件");
        } else {
            return Result.error(500, "验证码发送失败，请稍后重试");
        }
    }
}
