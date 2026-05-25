package com.minjue.modules.content.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.content.entity.CmsContent;
import com.minjue.modules.content.service.CmsContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Content/Discovery")
@RestController
@RequestMapping("/api/v1/content")
@RequiredArgsConstructor
public class CmsContentController {

    private final CmsContentService contentService;

    @Operation(summary = "Get Content List")
    @GetMapping("/list")
    public Result<Page<CmsContent>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword) {
        return Result.success(contentService.listContents(page, size, type, category, keyword));
    }

    @Operation(summary = "Get Content Detail")
    @GetMapping("/{id}")
    public Result<CmsContent> getById(@PathVariable Long id) {
        contentService.incrementViews(id);
        return Result.success(contentService.getById(id));
    }

    @Operation(summary = "Create Content")
    @PostMapping
    public Result<String> create(@RequestBody CmsContent content) {
        contentService.save(content);
        return Result.success("Created successfully");
    }

    @Operation(summary = "Update Content")
    @PutMapping
    public Result<String> update(@RequestBody CmsContent content) {
        contentService.updateById(content);
        return Result.success("Updated successfully");
    }

    @Operation(summary = "Delete Content")
    @DeleteMapping("/{id}")
    public Result<String> delete(@PathVariable Long id) {
        contentService.removeById(id);
        return Result.success("Deleted successfully");
    }
}
