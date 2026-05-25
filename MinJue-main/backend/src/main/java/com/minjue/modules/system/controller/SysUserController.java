package com.minjue.modules.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.minjue.common.result.Result;
import com.minjue.modules.system.dto.LoginDTO;
import com.minjue.modules.system.dto.RegisterDTO;
import com.minjue.modules.system.dto.ResetPasswordDTO;
import com.minjue.modules.system.entity.SysUser;
import com.minjue.modules.system.service.CaptchaService;
import com.minjue.modules.system.service.EmailService;
import com.minjue.modules.system.service.SysUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Tag(name = "User Management")
@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class SysUserController {

    private final SysUserService sysUserService;
    private final CaptchaService captchaService;
    private final EmailService emailService;

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public Result<String> login(@RequestBody LoginDTO loginDTO) {
        // 校验图形验证码
        if (loginDTO.getCaptchaUuid() == null || loginDTO.getCaptchaCode() == null) {
            return Result.error(400, "请输入验证码");
        }
        if (!captchaService.validateCaptcha(loginDTO.getCaptchaUuid(), loginDTO.getCaptchaCode())) {
            return Result.error(400, "验证码错误或已过期");
        }

        String token = sysUserService.login(loginDTO.getUsername(), loginDTO.getPassword(), loginDTO.getRole());
        return Result.success(token);
    }

    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public Result<String> register(@RequestBody RegisterDTO registerDTO) {
        // 校验图形验证码
        if (registerDTO.getCaptchaUuid() == null || registerDTO.getCaptchaCode() == null) {
            return Result.error(400, "请输入图形验证码");
        }
        if (!captchaService.validateCaptcha(registerDTO.getCaptchaUuid(), registerDTO.getCaptchaCode())) {
            return Result.error(400, "图形验证码错误或已过期");
        }

        // 校验邮箱验证码
        if (registerDTO.getEmail() == null || registerDTO.getEmailCode() == null) {
            return Result.error(400, "请输入邮箱验证码");
        }
        if (!emailService.validateEmailCode(registerDTO.getEmail(), registerDTO.getEmailCode(), "register")) {
            return Result.error(400, "邮箱验证码错误或已过期");
        }

        // 校验密码确认
        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            return Result.error(400, "两次密码输入不一致");
        }

        // 创建用户对象
        SysUser user = new SysUser();
        user.setUsername(registerDTO.getUsername());
        user.setPassword(registerDTO.getPassword());
        user.setEmail(registerDTO.getEmail());
        user.setNickname(registerDTO.getNickname());
        user.setRole(registerDTO.getRole());
        user.setPhone(registerDTO.getPhone());

        sysUserService.register(user);
        return Result.success("注册成功");
    }

    @Operation(summary = "获取当前用户信息")
    @GetMapping("/info")
    public Result<SysUser> getUserInfo(Principal principal) {
        if (principal == null) {
            return Result.error(401, "未登录");
        }
        SysUser user = sysUserService.getOne(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getUsername, principal.getName()));
        user.setPassword(null); // 隐藏密码
        return Result.success(user);
    }

    @Operation(summary = "重置密码")
    @PostMapping("/reset-password")
    public Result<String> resetPassword(@RequestBody ResetPasswordDTO resetDTO) {
        // 校验图形验证码
        if (resetDTO.getCaptchaUuid() == null || resetDTO.getCaptchaCode() == null) {
            return Result.error(400, "请输入图形验证码");
        }
        if (!captchaService.validateCaptcha(resetDTO.getCaptchaUuid(), resetDTO.getCaptchaCode())) {
            return Result.error(400, "图形验证码错误或已过期");
        }

        // 校验邮箱验证码
        if (resetDTO.getEmail() == null || resetDTO.getEmailCode() == null) {
            return Result.error(400, "请输入邮箱验证码");
        }
        if (!emailService.validateEmailCode(resetDTO.getEmail(), resetDTO.getEmailCode(), "reset")) {
            return Result.error(400, "邮箱验证码错误或已过期");
        }

        // 校验密码确认
        if (!resetDTO.getNewPassword().equals(resetDTO.getConfirmPassword())) {
            return Result.error(400, "两次密码输入不一致");
        }

        if (resetDTO.getUsername() == null || resetDTO.getUsername().isEmpty()) {
            return Result.error(400, "请输入用户名");
        }

        // 重置密码
        sysUserService.resetPassword(resetDTO.getUsername(), resetDTO.getEmail(), resetDTO.getNewPassword());
        return Result.success("密码重置成功");
    }
}
