package com.minjue.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.system.entity.SysUser;
import com.minjue.modules.system.service.SysUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Tag(name = "Admin User Management")
@RestController
@RequestMapping("/api/admin/user")
@RequiredArgsConstructor
public class AdminUserController {

    private final SysUserService sysUserService;
    private final PasswordEncoder passwordEncoder;

    @Operation(summary = "获取用户列表")
    @GetMapping("/list")
    public Result<IPage<SysUser>> getUserList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Integer status) {

        Page<SysUser> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<SysUser> queryWrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(username)) {
            queryWrapper.like(SysUser::getUsername, username)
                    .or().like(SysUser::getNickname, username);
        }
        if (StringUtils.hasText(role)) {
            queryWrapper.eq(SysUser::getRole, role);
        }
        if (status != null) {
            queryWrapper.eq(SysUser::getStatus, status);
        }

        queryWrapper.orderByDesc(SysUser::getCreateTime);

        IPage<SysUser> result = sysUserService.page(pageParam, queryWrapper);
        // 隐藏密码
        result.getRecords().forEach(u -> u.setPassword(null));

        return Result.success(result);
    }

    @Operation(summary = "获取用户详情")
    @GetMapping("/{id}")
    public Result<SysUser> getUserDetail(@PathVariable Long id) {
        SysUser user = sysUserService.getById(id);
        if (user == null) {
            return Result.error(404, "用户不存在");
        }
        user.setPassword(null);
        return Result.success(user);
    }

    @Operation(summary = "创建用户")
    @PostMapping("/create")
    public Result<String> createUser(@RequestBody SysUser user) {
        // 检查用户名是否已存在
        LambdaQueryWrapper<SysUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysUser::getUsername, user.getUsername());
        if (sysUserService.count(wrapper) > 0) {
            return Result.error(400, "用户名已存在");
        }

        // 加密密码
        if (StringUtils.hasText(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            // 默认密码 123456
            user.setPassword(passwordEncoder.encode("123456"));
        }

        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        if (user.getStatus() == null) {
            user.setStatus(1);
        }
        if (!StringUtils.hasText(user.getRole())) {
            user.setRole("USER");
        }

        sysUserService.save(user);
        return Result.success("用户创建成功");
    }

    @Operation(summary = "更新用户")
    @PutMapping("/{id}")
    public Result<String> updateUser(@PathVariable Long id, @RequestBody SysUser user) {
        SysUser existing = sysUserService.getById(id);
        if (existing == null) {
            return Result.error(404, "用户不存在");
        }

        // 不允许修改管理员角色
        if ("ADMIN".equals(existing.getRole()) && !"ADMIN".equals(user.getRole())) {
            return Result.error(403, "不能修改管理员角色");
        }

        user.setId(id);
        user.setUpdateTime(LocalDateTime.now());
        // 如果密码为空，不更新密码
        if (!StringUtils.hasText(user.getPassword())) {
            user.setPassword(null);
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        sysUserService.updateById(user);
        return Result.success("用户更新成功");
    }

    @Operation(summary = "删除用户")
    @DeleteMapping("/{id}")
    public Result<String> deleteUser(@PathVariable Long id) {
        SysUser user = sysUserService.getById(id);
        if (user == null) {
            return Result.error(404, "用户不存在");
        }
        if ("ADMIN".equals(user.getRole())) {
            return Result.error(403, "不能删除管理员账号");
        }

        sysUserService.removeById(id);
        return Result.success("用户删除成功");
    }

    @Operation(summary = "更新用户状态(封禁/解封)")
    @PutMapping("/{userId}/status")
    public Result<String> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam Integer status) {

        SysUser user = sysUserService.getById(userId);
        if (user == null) {
            return Result.error(404, "用户不存在");
        }

        // 不允许封禁管理员
        if ("ADMIN".equals(user.getRole())) {
            return Result.error(403, "无法更改管理员状态");
        }

        user.setStatus(status);
        user.setUpdateTime(LocalDateTime.now());
        sysUserService.updateById(user);
        return Result.success(status == 1 ? "用户已解封" : "用户已封禁");
    }

    @Operation(summary = "重置用户密码")
    @PostMapping("/{id}/reset-password")
    public Result<String> resetPassword(@PathVariable Long id) {
        SysUser user = sysUserService.getById(id);
        if (user == null) {
            return Result.error(404, "用户不存在");
        }

        // 重置为默认密码 123456
        user.setPassword(passwordEncoder.encode("123456"));
        user.setUpdateTime(LocalDateTime.now());
        sysUserService.updateById(user);

        return Result.success("密码已重置为 123456");
    }

    @Operation(summary = "批量删除用户")
    @DeleteMapping("/batch")
    public Result<String> batchDeleteUsers(@RequestBody List<Long> ids) {
        // 过滤掉管理员
        List<Long> validIds = ids.stream()
                .filter(id -> {
                    SysUser user = sysUserService.getById(id);
                    return user != null && !"ADMIN".equals(user.getRole());
                })
                .toList();
        sysUserService.removeByIds(validIds);
        return Result.success("已删除 " + validIds.size() + " 个用户");
    }

    @Operation(summary = "批量更新用户状态")
    @PutMapping("/batch/status")
    public Result<String> batchUpdateStatus(@RequestBody Map<String, Object> params) {
        @SuppressWarnings("unchecked")
        List<Integer> ids = (List<Integer>) params.get("ids");
        Integer status = (Integer) params.get("status");
        int count = 0;
        for (Integer id : ids) {
            SysUser user = sysUserService.getById(id.longValue());
            if (user != null && !"ADMIN".equals(user.getRole())) {
                user.setStatus(status);
                user.setUpdateTime(LocalDateTime.now());
                sysUserService.updateById(user);
                count++;
            }
        }
        return Result.success("已更新 " + count + " 个用户状态");
    }
}
