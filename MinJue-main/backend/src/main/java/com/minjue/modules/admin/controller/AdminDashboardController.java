package com.minjue.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.order.entity.OmsOrder;
import com.minjue.modules.order.service.OmsOrderService;
import com.minjue.modules.product.entity.PmsProduct;
import com.minjue.modules.product.service.PmsProductService;
import com.minjue.modules.leasing.entity.OmsLeasingApplication;
import com.minjue.modules.leasing.service.OmsLeasingApplicationService;
import com.minjue.modules.supplier.entity.OmsSupplier;
import com.minjue.modules.supplier.service.OmsSupplierService;
import com.minjue.modules.system.entity.SysUser;
import com.minjue.modules.system.service.SysUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 管理后台仪表盘控制器
 */
@Tag(name = "Admin Dashboard")
@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final SysUserService sysUserService;
    private final OmsSupplierService supplierService;
    private final PmsProductService productService;
    private final OmsOrderService orderService;
    private final OmsLeasingApplicationService leasingApplicationService;

    /**
     * 获取统计数据
     */
    @Operation(summary = "获取仪表盘统计数据")
    @GetMapping("/stats")
    public Result<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // 用户总数
        long userCount = sysUserService.count();
        stats.put("userCount", userCount);

        // 供应商总数
        long supplierCount = supplierService.count();
        stats.put("supplierCount", supplierCount);

        // 待审核供应商数量
        long pendingAuditCount = supplierService.count(
                new LambdaQueryWrapper<OmsSupplier>().eq(OmsSupplier::getIsVerified, 0)
        );
        stats.put("pendingAuditCount", pendingAuditCount);

        long pendingLeasingCount = leasingApplicationService.count(
                new LambdaQueryWrapper<OmsLeasingApplication>().eq(OmsLeasingApplication::getStatus, 0)
        );
        stats.put("pendingLeasingCount", pendingLeasingCount);

        // 商品总数
        long productCount = productService.count();
        stats.put("productCount", productCount);

        // 订单总数
        long orderCount = orderService.count();
        stats.put("orderCount", orderCount);

        return Result.success(stats);
    }

    /**
     * 获取最新注册用户
     */
    @Operation(summary = "获取最新注册用户")
    @GetMapping("/recent-users")
    public Result<List<SysUser>> getRecentUsers(
            @RequestParam(defaultValue = "5") Integer limit) {

        Page<SysUser> page = new Page<>(1, limit);
        LambdaQueryWrapper<SysUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(SysUser::getCreateTime);

        List<SysUser> users = sysUserService.page(page, wrapper).getRecords();
        // 隐藏密码
        users.forEach(u -> u.setPassword(null));

        return Result.success(users);
    }

    /**
     * 获取最新上架商品
     */
    @Operation(summary = "获取最新上架商品")
    @GetMapping("/recent-products")
    public Result<List<PmsProduct>> getRecentProducts(
            @RequestParam(defaultValue = "5") Integer limit) {

        Page<PmsProduct> page = new Page<>(1, limit);
        LambdaQueryWrapper<PmsProduct> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(PmsProduct::getCreateTime);

        List<PmsProduct> products = productService.page(page, wrapper).getRecords();

        return Result.success(products);
    }
}
