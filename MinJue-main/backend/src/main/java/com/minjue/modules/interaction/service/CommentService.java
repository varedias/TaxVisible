package com.minjue.modules.interaction.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.minjue.modules.interaction.entity.PmsComment;
import com.minjue.modules.interaction.mapper.PmsCommentMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService extends ServiceImpl<PmsCommentMapper, PmsComment> {

    /**
     * 获取指定商品的评论列表（分页）
     */
    public IPage<PmsComment> getCommentsByProductId(Long productId, int page, int size) {
        Page<PmsComment> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<PmsComment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PmsComment::getProductId, productId)
               .eq(PmsComment::getStatus, 1) // 只显示已审核的评论
               .orderByDesc(PmsComment::getCreateTime);
        return this.page(pageParam, wrapper);
    }

    /**
     * 获取指定商品的所有评论（不分页）
     */
    public List<PmsComment> getCommentListByProductId(Long productId) {
        LambdaQueryWrapper<PmsComment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PmsComment::getProductId, productId)
               .eq(PmsComment::getStatus, 1)
               .orderByDesc(PmsComment::getCreateTime);
        return this.list(wrapper);
    }

    /**
     * 发表评论
     */
    public PmsComment addComment(Long userId, String userName, String userAvatar,
                                  Long productId, Integer rating, String content, String images) {
        PmsComment comment = new PmsComment();
        comment.setUserId(userId);
        comment.setUserName(userName);
        comment.setUserAvatar(userAvatar);
        comment.setProductId(productId);
        comment.setRating(rating);
        comment.setContent(content);
        comment.setImages(images);
        comment.setHelpful(0);
        comment.setStatus(1); // 默认通过，如需审核改为 0
        comment.setCreateTime(LocalDateTime.now());
        this.save(comment);
        return comment;
    }

    /**
     * 删除评论（仅允许删除自己的评论）
     */
    public boolean deleteComment(Long commentId, Long userId) {
        LambdaQueryWrapper<PmsComment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PmsComment::getId, commentId)
               .eq(PmsComment::getUserId, userId);
        return this.remove(wrapper);
    }

    /**
     * 获取商品评论数
     */
    public long countByProductId(Long productId) {
        LambdaQueryWrapper<PmsComment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PmsComment::getProductId, productId)
               .eq(PmsComment::getStatus, 1);
        return this.count(wrapper);
    }

    /**
     * 点赞评论（helpful + 1）
     */
    public boolean helpfulComment(Long commentId) {
        PmsComment comment = this.getById(commentId);
        if (comment == null) return false;
        comment.setHelpful(comment.getHelpful() + 1);
        return this.updateById(comment);
    }
}
