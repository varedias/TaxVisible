package com.minjue.modules.system.controller;

import com.minjue.common.result.Result;
import com.minjue.modules.system.service.CaptchaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 验证码控制器
 */
@Tag(name = "Captcha")
@RestController
@RequestMapping("/api/v1/captcha")
@RequiredArgsConstructor
public class CaptchaController {

    private final CaptchaService captchaService;

    @Operation(summary = "获取图形验证码")
    @GetMapping("/image")
    public Result<Map<String, String>> getImageCaptcha() {
        Map<String, String> captcha = captchaService.generateCaptcha();
        return Result.success(captcha);
    }
}
