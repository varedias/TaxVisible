package com.minjue.modules.supplier.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.supplier.entity.OmsSupplier;
import com.minjue.modules.supplier.service.OmsSupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Supplier Management")
@RestController
@RequestMapping("/api/v1/supplier")
@RequiredArgsConstructor
public class OmsSupplierController {

    private final OmsSupplierService supplierService;

    @Operation(summary = "Get Supplier List")
    @GetMapping("/list")
    public Result<Page<OmsSupplier>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<OmsSupplier> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.like(OmsSupplier::getName, keyword)
                   .or().like(OmsSupplier::getDescription, keyword);
        }
        wrapper.orderByDesc(OmsSupplier::getIsVerified)
               .orderByDesc(OmsSupplier::getCreateTime);
        Page<OmsSupplier> pageResult = supplierService.page(new Page<>(page, size), wrapper);
        return Result.success(pageResult);
    }

    @Operation(summary = "Get Supplier Detail")
    @GetMapping("/{id}")
    public Result<OmsSupplier> getById(@PathVariable Long id) {
        return Result.success(supplierService.getById(id));
    }

    @Operation(summary = "Create Supplier")
    @PostMapping
    public Result<String> create(@RequestBody OmsSupplier supplier) {
        supplierService.save(supplier);
        return Result.success("Created successfully");
    }

    @Operation(summary = "Update Supplier")
    @PutMapping
    public Result<String> update(@RequestBody OmsSupplier supplier) {
        supplierService.updateById(supplier);
        return Result.success("Updated successfully");
    }

    @Operation(summary = "Delete Supplier")
    @DeleteMapping("/{id}")
    public Result<String> delete(@PathVariable Long id) {
        supplierService.removeById(id);
        return Result.success("Deleted successfully");
    }
}
