package com.minjue.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.product.entity.PmsProduct;
import com.minjue.modules.product.service.PmsProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Tag(name = "Admin Product Management")
@RestController
@RequestMapping("/api/admin/product")
@RequiredArgsConstructor
public class AdminProductController {

    private final PmsProductService pmsProductService;

    @Operation(summary = "获取商品列表")
    @GetMapping("/list")
    public Result<IPage<PmsProduct>> getProductList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer status) {

        Page<PmsProduct> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<PmsProduct> queryWrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(name)) {
            queryWrapper.like(PmsProduct::getName, name);
        }

        if (status != null) {
            queryWrapper.eq(PmsProduct::getStatus, status);
        }

        queryWrapper.orderByDesc(PmsProduct::getCreateTime);

        IPage<PmsProduct> result = pmsProductService.page(pageParam, queryWrapper);
        return Result.success(result);
    }

    @Operation(summary = "获取商品详情")
    @GetMapping("/{id}")
    public Result<PmsProduct> getProductDetail(@PathVariable Long id) {
        PmsProduct product = pmsProductService.getById(id);
        if (product == null) {
            return Result.error(404, "商品不存在");
        }
        return Result.success(product);
    }

    @Operation(summary = "创建商品")
    @PostMapping("/create")
    public Result<String> createProduct(@RequestBody PmsProduct product) {
        product.setCreateTime(LocalDateTime.now());
        if (product.getStatus() == null) {
            product.setStatus(1);
        }
        if (product.getSales() == null) {
            product.setSales(0);
        }
        if (product.getViews() == null) {
            product.setViews(0);
        }
        pmsProductService.save(product);
        return Result.success("商品创建成功");
    }

    @Operation(summary = "更新商品")
    @PutMapping("/{id}")
    public Result<String> updateProduct(@PathVariable Long id, @RequestBody PmsProduct product) {
        PmsProduct existing = pmsProductService.getById(id);
        if (existing == null) {
            return Result.error(404, "商品不存在");
        }
        product.setId(id);
        pmsProductService.updateById(product);
        return Result.success("商品更新成功");
    }

    @Operation(summary = "删除商品")
    @DeleteMapping("/{id}")
    public Result<String> deleteProduct(@PathVariable Long id) {
        PmsProduct product = pmsProductService.getById(id);
        if (product == null) {
            return Result.error(404, "商品不存在");
        }
        pmsProductService.removeById(id);
        return Result.success("商品删除成功");
    }

    @Operation(summary = "强制下架商品")
    @PostMapping("/off-shelf")
    public Result<String> offShelfProduct(@RequestBody Map<String, Object> params) {
        Long productId = Long.valueOf(params.get("id").toString());
        
        PmsProduct product = pmsProductService.getById(productId);
        if (product == null) {
            return Result.error(404, "商品不存在");
        }

        product.setStatus(0);
        pmsProductService.updateById(product);

        return Result.success("商品已强制下架");
    }

    @Operation(summary = "上架商品")
    @PostMapping("/on-shelf")
    public Result<String> onShelfProduct(@RequestBody Map<String, Object> params) {
        Long productId = Long.valueOf(params.get("id").toString());
        
        PmsProduct product = pmsProductService.getById(productId);
        if (product == null) {
            return Result.error(404, "商品不存在");
        }

        product.setStatus(1);
        pmsProductService.updateById(product);

        return Result.success("商品已上架");
    }

    @Operation(summary = "批量删除商品")
    @DeleteMapping("/batch")
    public Result<String> batchDeleteProducts(@RequestBody List<Long> ids) {
        pmsProductService.removeByIds(ids);
        return Result.success("已删除 " + ids.size() + " 个商品");
    }

    @Operation(summary = "批量上架商品")
    @PostMapping("/batch/on-shelf")
    public Result<String> batchOnShelf(@RequestBody List<Long> ids) {
        for (Long id : ids) {
            PmsProduct product = pmsProductService.getById(id);
            if (product != null) {
                product.setStatus(1);
                pmsProductService.updateById(product);
            }
        }
        return Result.success("已上架 " + ids.size() + " 个商品");
    }

    @Operation(summary = "批量下架商品")
    @PostMapping("/batch/off-shelf")
    public Result<String> batchOffShelf(@RequestBody List<Long> ids) {
        for (Long id : ids) {
            PmsProduct product = pmsProductService.getById(id);
            if (product != null) {
                product.setStatus(0);
                pmsProductService.updateById(product);
            }
        }
        return Result.success("已下架 " + ids.size() + " 个商品");
    }
}
