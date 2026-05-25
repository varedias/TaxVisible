package com.minjue.modules.search.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.content.entity.CmsContent;
import com.minjue.modules.content.service.CmsContentService;
import com.minjue.modules.product.entity.PmsProduct;
import com.minjue.modules.product.service.PmsProductService;
import com.minjue.modules.supplier.entity.OmsSupplier;
import com.minjue.modules.supplier.service.OmsSupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 统一搜索Controller — 聚合商品/内容/供应商搜索结果
 */
@Tag(name = "Search API")
@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final PmsProductService productService;
    private final CmsContentService contentService;
    private final OmsSupplierService supplierService;

    @Operation(summary = "统一搜索")
    @GetMapping
    public Result<Map<String, Object>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "12") Integer size) {

        Map<String, Object> result = new HashMap<>();

        if (!StringUtils.hasText(keyword)) {
            return Result.success(result);
        }

        // 商品搜索
        if ("all".equals(type) || "product".equals(type)) {
            LambdaQueryWrapper<PmsProduct> pw = new LambdaQueryWrapper<>();
            pw.eq(PmsProduct::getStatus, 1)
              .and(w -> w.like(PmsProduct::getName, keyword)
                        .or().like(PmsProduct::getDescription, keyword))
              .orderByDesc(PmsProduct::getSales);
            IPage<PmsProduct> products = productService.page(new Page<>(page, size), pw);
            result.put("products", products);
        }

        // 内容搜索
        if ("all".equals(type) || "content".equals(type)) {
            LambdaQueryWrapper<CmsContent> cw = new LambdaQueryWrapper<>();
            cw.eq(CmsContent::getStatus, 1)
              .like(CmsContent::getTitle, keyword)
              .orderByDesc(CmsContent::getCreateTime);
            IPage<CmsContent> contents = contentService.page(new Page<>(page, size), cw);
            result.put("contents", contents);
        }

        // 供应商搜索
        if ("all".equals(type) || "supplier".equals(type)) {
            LambdaQueryWrapper<OmsSupplier> sw = new LambdaQueryWrapper<>();
            sw.eq(OmsSupplier::getIsVerified, 1)
              .and(w -> w.like(OmsSupplier::getName, keyword)
                        .or().like(OmsSupplier::getDescription, keyword))
              .orderByDesc(OmsSupplier::getCreateTime);
            IPage<OmsSupplier> suppliers = supplierService.page(new Page<>(page, size), sw);
            result.put("suppliers", suppliers);
        }

        return Result.success(result);
    }
}
