package com.minjue.modules.system.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.minjue.common.exception.CustomException;
import com.minjue.common.utils.JwtUtil;
import com.minjue.modules.system.entity.SysUser;
import com.minjue.modules.system.mapper.SysUserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SysUserService extends ServiceImpl<SysUserMapper, SysUser> {

    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String login(String username, String password, String role) {
        SysUser user = getOne(new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, username));
        if (user == null) {
            throw new CustomException("用户不存在");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new CustomException("密码错误");
        }
        if (user.getStatus() == 0) {
            throw new CustomException("账号已禁用");
        }

        // 角色校验逻辑
        // 如果数据库角色是 ADMIN，允许以任何身份登录（自动识别为管理员）
        if ("ADMIN".equals(user.getRole())) {
            // 管理员可以用任何角色登录，登录后自动识别为管理员
        } else {
            // 非管理员，严格校验身份
            if ("supplier".equals(role)) {
                if (!"SUPPLIER".equals(user.getRole())) {
                    throw new CustomException("该账号不是供应商账号，请切换身份登录");
                }
            } else if ("buyer".equals(role)) {
                // buyer 对应数据库的 USER 角色
                if (!"USER".equals(user.getRole())) {
                    throw new CustomException("该账号不是采购方账号，请切换身份登录");
                }
            }
        }

        return jwtUtil.generateToken(username);
    }

    public void register(SysUser user) {
        if (count(new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, user.getUsername())) > 0) {
            throw new CustomException("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        user.setStatus(1); // Default enabled
        if (user.getRole() == null) {
            user.setRole("USER");
        }
        save(user);
    }

    /**
     * 重置密码
     * 
     * @param username    用户名
     * @param email       用户邮箱
     * @param newPassword 新密码
     */
    public void resetPassword(String username, String email, String newPassword) {
        SysUser user = getOne(new LambdaQueryWrapper<SysUser>()
                .eq(SysUser::getUsername, username)
                .eq(SysUser::getEmail, email));

        if (user == null) {
            throw new CustomException("用户名或邮箱错误，或者该账号未绑定此邮箱");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdateTime(LocalDateTime.now());
        updateById(user);
    }
}
