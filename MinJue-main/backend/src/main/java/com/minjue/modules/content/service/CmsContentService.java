package com.minjue.modules.content.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.minjue.modules.content.entity.CmsContent;
import com.minjue.modules.content.mapper.CmsContentMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class CmsContentService extends ServiceImpl<CmsContentMapper, CmsContent> {

    /**
     * 分页查询内容列表
     */
    public Page<CmsContent> listContents(Integer page, Integer size, String type, String category, String keyword) {
        LambdaQueryWrapper<CmsContent> wrapper = new LambdaQueryWrapper<>();

        // 类型筛选
        if (StringUtils.hasText(type)) {
            wrapper.eq(CmsContent::getType, type);
        }

        // 分类筛选
        if (StringUtils.hasText(category)) {
            wrapper.eq(CmsContent::getCategory, category);
        }

        // 关键词搜索
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(CmsContent::getTitle, keyword)
                    .or().like(CmsContent::getAuthor, keyword)
                    .or().like(CmsContent::getTags, keyword));
        }

        // 只查询已发布的
        wrapper.eq(CmsContent::getStatus, 1);

        // 按浏览量排序
        wrapper.orderByDesc(CmsContent::getViews);

        return page(new Page<>(page, size), wrapper);
    }

    /**
     * 增加浏览量
     */
    public void incrementViews(Long id) {
        CmsContent content = getById(id);
        if (content != null) {
            content.setViews(content.getViews() == null ? 1 : content.getViews() + 1);
            updateById(content);
        }
    }
}
