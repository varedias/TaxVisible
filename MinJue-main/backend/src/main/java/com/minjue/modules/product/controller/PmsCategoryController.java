package com.minjue.modules.product.controller;

import com.minjue.common.result.Result;
import com.minjue.modules.product.entity.PmsCategory;
import com.minjue.modules.product.service.PmsCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Category Management")
@RestController
@RequestMapping("/api/v1/category")
@RequiredArgsConstructor
public class PmsCategoryController {

    private final PmsCategoryService categoryService;

    @Operation(summary = "Get All Categories")
    @GetMapping("/list")
    public Result<List<PmsCategory>> list() {
        return Result.success(categoryService.list());
    }

    @Operation(summary = "Create Category")
    @PostMapping
    public Result<String> create(@RequestBody PmsCategory category) {
        categoryService.save(category);
        return Result.success("Created successfully");
    }

    @Operation(summary = "Update Category")
    @PutMapping
    public Result<String> update(@RequestBody PmsCategory category) {
        categoryService.updateById(category);
        return Result.success("Updated successfully");
    }

    @Operation(summary = "Delete Category")
    @DeleteMapping("/{id}")
    public Result<String> delete(@PathVariable Long id) {
        categoryService.removeById(id);
        return Result.success("Deleted successfully");
    }
}
