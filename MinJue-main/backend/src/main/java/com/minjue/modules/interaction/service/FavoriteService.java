package com.minjue.modules.interaction.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.minjue.modules.interaction.entity.UmsFavorite;
import com.minjue.modules.interaction.mapper.UmsFavoriteMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FavoriteService extends ServiceImpl<UmsFavoriteMapper, UmsFavorite> {

    /**
     * 切换收藏状态（已收藏则取消，未收藏则新增）
     * @return true 表示收藏，false 表示取消收藏
     */
    public boolean toggleFavorite(Long userId, Long targetId, String targetType,
                                   String targetName, String targetImage) {
        LambdaQueryWrapper<UmsFavorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UmsFavorite::getUserId, userId)
               .eq(UmsFavorite::getTargetId, targetId)
               .eq(UmsFavorite::getTargetType, targetType);
        UmsFavorite existing = this.getOne(wrapper);
        if (existing != null) {
            this.removeById(existing.getId());
            return false; // 取消收藏
        } else {
            UmsFavorite favorite = new UmsFavorite();
            favorite.setUserId(userId);
            favorite.setTargetId(targetId);
            favorite.setTargetType(targetType);
            favorite.setTargetName(targetName);
            favorite.setTargetImage(targetImage);
            favorite.setCreateTime(LocalDateTime.now());
            this.save(favorite);
            return true; // 收藏
        }
    }

    /**
     * 检查用户是否已收藏
     */
    public boolean isFavorited(Long userId, Long targetId, String targetType) {
        LambdaQueryWrapper<UmsFavorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UmsFavorite::getUserId, userId)
               .eq(UmsFavorite::getTargetId, targetId)
               .eq(UmsFavorite::getTargetType, targetType);
        return this.count(wrapper) > 0;
    }

    /**
     * 获取用户的收藏列表（分页）
     */
    public IPage<UmsFavorite> getUserFavorites(Long userId, int page, int size) {
        Page<UmsFavorite> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<UmsFavorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UmsFavorite::getUserId, userId)
               .orderByDesc(UmsFavorite::getCreateTime);
        return this.page(pageParam, wrapper);
    }

    /**
     * 按类型获取用户收藏列表（分页）
     */
    public IPage<UmsFavorite> getUserFavoritesByType(Long userId, String targetType, int page, int size) {
        Page<UmsFavorite> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<UmsFavorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UmsFavorite::getUserId, userId)
               .eq(UmsFavorite::getTargetType, targetType)
               .orderByDesc(UmsFavorite::getCreateTime);
        return this.page(pageParam, wrapper);
    }

    /**
     * 获取目标的收藏数
     */
    public long countFavorites(Long targetId, String targetType) {
        LambdaQueryWrapper<UmsFavorite> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UmsFavorite::getTargetId, targetId)
               .eq(UmsFavorite::getTargetType, targetType);
        return this.count(wrapper);
    }
}
