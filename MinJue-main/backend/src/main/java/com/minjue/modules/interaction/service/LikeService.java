package com.minjue.modules.interaction.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.minjue.modules.interaction.entity.UmsLike;
import com.minjue.modules.interaction.mapper.UmsLikeMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LikeService extends ServiceImpl<UmsLikeMapper, UmsLike> {

    /**
     * 切换点赞状态（已点赞则取消，未点赞则新增）
     * @return true 表示点赞，false 表示取消点赞
     */
    public boolean toggleLike(Long userId, Long targetId, String targetType) {
        LambdaQueryWrapper<UmsLike> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UmsLike::getUserId, userId)
               .eq(UmsLike::getTargetId, targetId)
               .eq(UmsLike::getTargetType, targetType);
        UmsLike existing = this.getOne(wrapper);
        if (existing != null) {
            this.removeById(existing.getId());
            return false; // 取消点赞
        } else {
            UmsLike like = new UmsLike();
            like.setUserId(userId);
            like.setTargetId(targetId);
            like.setTargetType(targetType);
            like.setCreateTime(LocalDateTime.now());
            this.save(like);
            return true; // 点赞
        }
    }

    /**
     * 检查用户是否已点赞
     */
    public boolean isLiked(Long userId, Long targetId, String targetType) {
        LambdaQueryWrapper<UmsLike> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UmsLike::getUserId, userId)
               .eq(UmsLike::getTargetId, targetId)
               .eq(UmsLike::getTargetType, targetType);
        return this.count(wrapper) > 0;
    }

    /**
     * 获取目标的点赞数
     */
    public long countLikes(Long targetId, String targetType) {
        LambdaQueryWrapper<UmsLike> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UmsLike::getTargetId, targetId)
               .eq(UmsLike::getTargetType, targetType);
        return this.count(wrapper);
    }
}
