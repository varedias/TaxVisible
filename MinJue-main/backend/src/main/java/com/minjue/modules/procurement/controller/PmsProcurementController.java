package com.minjue.modules.procurement.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.procurement.entity.PmsProcurement;
import com.minjue.modules.procurement.service.PmsProcurementService;
import com.minjue.modules.system.entity.SysUser;
import com.minjue.modules.system.service.SysUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;

/**
 * 采购需求Controller — 用户端
 */
@Tag(name = "Procurement API")
@RestController
@RequestMapping("/api/v1/procurement")
@RequiredArgsConstructor
public class PmsProcurementController {

    private final PmsProcurementService procurementService;
    private final SysUserService sysUserService;

    @Operation(summary = "获取采购需求列表")
    @GetMapping("/list")
    public Result<IPage<PmsProcurement>> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status) {

        Page<PmsProcurement> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<PmsProcurement> wrapper = new LambdaQueryWrapper<>();

        // 默认只查进行中的采购
        if (status != null) {
            wrapper.eq(PmsProcurement::getStatus, status);
        } else {
            wrapper.eq(PmsProcurement::getStatus, 1);
        }

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(PmsProcurement::getTitle, keyword)
                              .or().like(PmsProcurement::getDescription, keyword));
        }

        wrapper.orderByDesc(PmsProcurement::getCreateTime);
        IPage<PmsProcurement> result = procurementService.page(pageParam, wrapper);
        return Result.success(result);
    }

    @Operation(summary = "获取采购需求详情")
    @GetMapping("/{id}")
    public Result<PmsProcurement> getDetail(@PathVariable Long id) {
        PmsProcurement procurement = procurementService.getById(id);
        if (procurement == null) {
            return Result.error(404, "采购需求不存在");
        }
        return Result.success(procurement);
    }

    @Operation(summary = "发布采购需求")
    @PostMapping
    public Result<String> create(@RequestBody PmsProcurement procurement, Principal principal) {
        if (principal == null) {
            return Result.error(401, "请先登录");
        }
        SysUser user = sysUserService.getOne(
            new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, principal.getName())
        );
        if (user == null) {
            return Result.error(401, "用户不存在");
        }

        procurement.setUserId(user.getId());
        procurement.setStatus(1);
        procurement.setCreateTime(LocalDateTime.now());
        procurement.setUpdateTime(LocalDateTime.now());
        procurementService.save(procurement);
        return Result.success("发布成功");
    }

    @Operation(summary = "获取我的采购需求")
    @GetMapping("/my")
    public Result<IPage<PmsProcurement>> getMyProcurements(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            Principal principal) {

        if (principal == null) {
            return Result.error(401, "请先登录");
        }
        SysUser user = sysUserService.getOne(
            new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, principal.getName())
        );
        if (user == null) {
            return Result.error(401, "用户不存在");
        }

        Page<PmsProcurement> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<PmsProcurement> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PmsProcurement::getUserId, user.getId())
               .orderByDesc(PmsProcurement::getCreateTime);

        IPage<PmsProcurement> result = procurementService.page(pageParam, wrapper);
        return Result.success(result);
    }

    @Operation(summary = "关闭采购需求")
    @PostMapping("/{id}/close")
    public Result<String> close(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return Result.error(401, "请先登录");
        }
        SysUser user = sysUserService.getOne(
            new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, principal.getName())
        );

        PmsProcurement procurement = procurementService.getById(id);
        if (procurement == null) {
            return Result.error(404, "采购需求不存在");
        }
        if (!procurement.getUserId().equals(user.getId())) {
            return Result.error(403, "无权操作");
        }

        procurement.setStatus(3);
        procurement.setUpdateTime(LocalDateTime.now());
        procurementService.updateById(procurement);
        return Result.success("已关闭");
    }
}
