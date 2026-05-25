package com.minjue.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.minjue.common.exception.CustomException;
import com.minjue.common.result.Result;
import com.minjue.common.utils.JwtUtil;
import com.minjue.modules.admin.dto.AdminLoginDTO;
import com.minjue.modules.system.entity.SysUser;
import com.minjue.modules.system.service.CaptchaService;
import com.minjue.modules.system.service.SysUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Tag(name = "Admin Auth Management")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminAuthController {

    private final SysUserService sysUserService;
    private final CaptchaService captchaService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Operation(summary = "管理员登录")
    @PostMapping("/login")
    public Result<String> login(@RequestBody AdminLoginDTO loginDTO) {
        // 1. 验证码校验
        if (loginDTO.getCaptchaUuid() != null && loginDTO.getCaptchaCode() != null) {
            if (!captchaService.validateCaptcha(loginDTO.getCaptchaUuid(), loginDTO.getCaptchaCode())) {
                return Result.error(400, "验证码错误或已过期");
            }
        }

        // 2. 查询用户
        SysUser user = sysUserService.getOne(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getUsername, loginDTO.getUsername()));

        if (user == null) {
            throw new CustomException("账号不存在");
        }

        // 3. 校验密码
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new CustomException("密码错误");
        }

        // 4. 校验权限 (核心：必须是 ADMIN)
        if (!"ADMIN".equals(user.getRole())) {
            throw new CustomException("无权访问管理后台");
        }

        // 5. 生成 Token
        String token = jwtUtil.generateToken(user.getUsername());
        return Result.success(token);
    }

    @Operation(summary = "获取管理员信息")
    @GetMapping("/info")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<SysUser> getInfo(Principal principal) {
        if (principal == null) {
            return Result.error(401, "未登录");
        }
        SysUser user = sysUserService.getOne(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getUsername, principal.getName()));
        user.setPassword(null);
        return Result.success(user);
    }
}
