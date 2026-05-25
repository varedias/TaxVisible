package com.minjue.modules.interaction.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.minjue.modules.interaction.entity.UmsShare;
import com.minjue.modules.interaction.mapper.UmsShareMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ShareService extends ServiceImpl<UmsShareMapper, UmsShare> {

    /**
     * 添加分享记录
     */
    public UmsShare addShare(Long userId, Long targetId, String targetType,
                              String targetName, String shareUrl, String platform) {
        UmsShare share = new UmsShare();
        share.setUserId(userId);
        share.setTargetId(targetId);
        share.setTargetType(targetType);
        share.setTargetName(targetName);
        share.setShareUrl(shareUrl);
        share.setPlatform(platform);
        share.setCreateTime(LocalDateTime.now());
        this.save(share);
        return share;
    }

    /**
     * 获取目标的分享次数
     */
    public long countShares(Long targetId, String targetType) {
        LambdaQueryWrapper<UmsShare> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UmsShare::getTargetId, targetId)
               .eq(UmsShare::getTargetType, targetType);
        return this.count(wrapper);
    }
}
