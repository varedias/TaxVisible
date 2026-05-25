package com.minjue.modules.product.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.minjue.modules.product.entity.PmsProduct;
import com.minjue.modules.product.mapper.PmsProductMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class PmsProductService extends ServiceImpl<PmsProductMapper, PmsProduct> {

    /**
     * 分页查询商品列表，支持搜索和分类筛选
     */
    public Page<PmsProduct> listProducts(Integer page, Integer size, String keyword, Long categoryId) {
        LambdaQueryWrapper<PmsProduct> wrapper = new LambdaQueryWrapper<>();

        // 关键词搜索
        if (StringUtils.hasText(keyword)) {
            wrapper.like(PmsProduct::getName, keyword)
                    .or()
                    .like(PmsProduct::getDescription, keyword);
        }

        // 分类筛选
        if (categoryId != null && categoryId > 0) {
            wrapper.eq(PmsProduct::getCategoryId, categoryId);
        }

        // 只查询上架商品
        wrapper.eq(PmsProduct::getStatus, 1);

        // 按销量排序
        wrapper.orderByDesc(PmsProduct::getSales);

        return page(new Page<>(page, size), wrapper);
    }
}
