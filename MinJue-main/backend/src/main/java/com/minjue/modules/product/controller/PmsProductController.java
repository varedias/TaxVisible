package com.minjue.modules.product.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.product.entity.PmsCategory;
import com.minjue.modules.product.entity.PmsProduct;
import com.minjue.modules.product.service.PmsCategoryService;
import com.minjue.modules.product.service.PmsProductService;
import com.minjue.modules.supplier.entity.OmsSupplier;
import com.minjue.modules.supplier.service.OmsSupplierService;
import com.minjue.modules.system.entity.SysUser;
import com.minjue.modules.system.service.SysUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户端商品Controller
 */
@Tag(name = "Product API")
@RestController
@RequestMapping("/api/v1/product")
@RequiredArgsConstructor
public class PmsProductController {

    private final PmsProductService productService;
    private final PmsCategoryService categoryService;
    private final SysUserService sysUserService;
    private final OmsSupplierService supplierService;

    @Operation(summary = "获取商品列表（用户端）")
    @GetMapping("/list")
    public Result<IPage<PmsProduct>> getProductList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "12") Integer size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "false") Boolean includeOffShelf) {

        Page<PmsProduct> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<PmsProduct> wrapper = new LambdaQueryWrapper<>();

        // 默认只显示上架商品，除非明确要求包含下架商品
        if (!includeOffShelf) {
            wrapper.eq(PmsProduct::getStatus, 1);
        }

        // 关键词搜索
        if (StringUtils.hasText(name)) {
            wrapper.like(PmsProduct::getName, name);
        }

        // 分类筛选
        if (categoryId != null) {
            wrapper.eq(PmsProduct::getCategoryId, categoryId);
        }

        // 供应商筛选
        if (supplierId != null) {
            wrapper.eq(PmsProduct::getSupplierId, supplierId);
        }

        // 排序
        if ("sales".equals(sort)) {
            wrapper.orderByDesc(PmsProduct::getSales);
        } else if ("price-low".equals(sort)) {
            wrapper.orderByAsc(PmsProduct::getPrice);
        } else if ("price-high".equals(sort)) {
            wrapper.orderByDesc(PmsProduct::getPrice);
        } else if ("newest".equals(sort)) {
            wrapper.orderByDesc(PmsProduct::getCreateTime);
        } else {
            // 默认综合排序：销量 + 浏览量
            wrapper.orderByDesc(PmsProduct::getSales)
                   .orderByDesc(PmsProduct::getViews);
        }

        IPage<PmsProduct> result = productService.page(pageParam, wrapper);
        return Result.success(result);
    }

    @Operation(summary = "获取商品详情")
    @GetMapping("/{id}")
    public Result<PmsProduct> getProductDetail(@PathVariable Long id) {
        PmsProduct product = productService.getById(id);
        if (product == null) {
            return Result.error(404, "商品不存在");
        }

        // 增加浏览量
        product.setViews(product.getViews() + 1);
        productService.updateById(product);

        return Result.success(product);
    }

    @Operation(summary = "获取商品分类")
    @GetMapping("/categories")
    public Result<List<PmsCategory>> getCategories() {
        List<PmsCategory> categories = categoryService.list(
            new LambdaQueryWrapper<PmsCategory>()
                .orderByAsc(PmsCategory::getSort)
        );
        return Result.success(categories);
    }

    // ==================== 供应商商品管理接口 ====================

    private OmsSupplier getSupplierByPrincipal(Principal principal) {
        if (principal == null) return null;
        SysUser user = sysUserService.getOne(
            new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, principal.getName())
        );
        if (user == null) return null;
        return supplierService.getOne(
            new LambdaQueryWrapper<OmsSupplier>().eq(OmsSupplier::getUserId, user.getId())
        );
    }

    @Operation(summary = "供应商获取自己的商品列表")
    @GetMapping("/supplier/my")
    public Result<?> supplierMyProducts(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        OmsSupplier supplier = getSupplierByPrincipal(principal);
        if (supplier == null) {
            return Result.error(403, "仅供应商可操作");
        }
        Page<PmsProduct> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<PmsProduct> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PmsProduct::getSupplierId, supplier.getId());
        wrapper.orderByDesc(PmsProduct::getCreateTime);
        return Result.success(productService.page(pageParam, wrapper));
    }

    @Operation(summary = "供应商发布商品")
    @PostMapping("/supplier/create")
    public Result<String> supplierCreate(@RequestBody PmsProduct product, Principal principal) {
        OmsSupplier supplier = getSupplierByPrincipal(principal);
        if (supplier == null) {
            return Result.error(403, "仅供应商可发布商品");
        }
        product.setSupplierId(supplier.getId());
        product.setStatus(1);
        product.setSales(0);
        product.setViews(0);
        product.setCreateTime(LocalDateTime.now());
        productService.save(product);
        return Result.success("发布成功");
    }

    @Operation(summary = "供应商更新商品")
    @PutMapping("/supplier/{id}")
    public Result<String> supplierUpdate(@PathVariable Long id, @RequestBody PmsProduct product, Principal principal) {
        OmsSupplier supplier = getSupplierByPrincipal(principal);
        if (supplier == null) {
            return Result.error(403, "仅供应商可操作");
        }
        PmsProduct existing = productService.getById(id);
        if (existing == null) {
            return Result.error(404, "商品不存在");
        }
        if (!existing.getSupplierId().equals(supplier.getId())) {
            return Result.error(403, "无权修改他人商品");
        }
        product.setId(id);
        product.setSupplierId(supplier.getId());
        productService.updateById(product);
        return Result.success("更新成功");
    }

    @Operation(summary = "供应商上下架商品")
    @PostMapping("/supplier/{id}/status")
    public Result<String> supplierToggleStatus(@PathVariable Long id, @RequestParam Integer status, Principal principal) {
        OmsSupplier supplier = getSupplierByPrincipal(principal);
        if (supplier == null) {
            return Result.error(403, "仅供应商可操作");
        }
        PmsProduct existing = productService.getById(id);
        if (existing == null) {
            return Result.error(404, "商品不存在");
        }
        if (!existing.getSupplierId().equals(supplier.getId())) {
            return Result.error(403, "无权操作他人商品");
        }
        existing.setStatus(status);
        productService.updateById(existing);
        return Result.success(status == 1 ? "已上架" : "已下架");
    }

    @Operation(summary = "供应商删除商品")
    @DeleteMapping("/supplier/{id}")
    public Result<String> supplierDelete(@PathVariable Long id, Principal principal) {
        OmsSupplier supplier = getSupplierByPrincipal(principal);
        if (supplier == null) {
            return Result.error(403, "仅供应商可操作");
        }
        PmsProduct existing = productService.getById(id);
        if (existing == null) {
            return Result.error(404, "商品不存在");
        }
        if (!existing.getSupplierId().equals(supplier.getId())) {
            return Result.error(403, "无权删除他人商品");
        }
        productService.removeById(id);
        return Result.success("已删除");
    }
}
