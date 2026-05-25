package com.minjue.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.interaction.entity.*;
import com.minjue.modules.interaction.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 管理后台 - 用户交互数据管理
 */
@Tag(name = "Admin Interaction Management")
@RestController
@RequestMapping("/api/admin/interaction")
@RequiredArgsConstructor
public class AdminInteractionController {

    private final CommentService commentService;
    private final LikeService likeService;
    private final FavoriteService favoriteService;
    private final ShareService shareService;

    // ==================== 评论管理 ====================

    @Operation(summary = "获取评论列表")
    @GetMapping("/comment/list")
    public Result<IPage<PmsComment>> getCommentList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer rating) {

        Page<PmsComment> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<PmsComment> wrapper = new LambdaQueryWrapper<>();

        if (productId != null) wrapper.eq(PmsComment::getProductId, productId);
        if (status != null) wrapper.eq(PmsComment::getStatus, status);
        if (rating != null) wrapper.eq(PmsComment::getRating, rating);
        wrapper.orderByDesc(PmsComment::getCreateTime);

        return Result.success(commentService.page(pageParam, wrapper));
    }

    @Operation(summary = "更新评论状态")
    @PutMapping("/comment/{id}/status")
    public Result<String> updateCommentStatus(@PathVariable Long id, @RequestParam Integer status) {
        PmsComment comment = commentService.getById(id);
        if (comment == null) return Result.error(404, "评论不存在");
        comment.setStatus(status);
        commentService.updateById(comment);
        return Result.success(status == 1 ? "评论已显示" : "评论已隐藏");
    }

    @Operation(summary = "删除评论")
    @DeleteMapping("/comment/{id}")
    public Result<String> deleteComment(@PathVariable Long id) {
        commentService.removeById(id);
        return Result.success("评论已删除");
    }

    @Operation(summary = "批量删除评论")
    @DeleteMapping("/comment/batch")
    public Result<String> batchDeleteComments(@RequestBody List<Long> ids) {
        commentService.removeByIds(ids);
        return Result.success("已删除 " + ids.size() + " 条评论");
    }

    @Operation(summary = "批量更新评论状态")
    @PutMapping("/comment/batch/status")
    public Result<String> batchUpdateCommentStatus(@RequestBody Map<String, Object> params) {
        @SuppressWarnings("unchecked")
        List<Long> ids = (List<Long>) params.get("ids");
        Integer status = (Integer) params.get("status");
        for (Long id : ids) {
            PmsComment comment = commentService.getById(id);
            if (comment != null) {
                comment.setStatus(status);
                commentService.updateById(comment);
            }
        }
        return Result.success("已更新 " + ids.size() + " 条评论状态");
    }

    // ==================== 点赞管理 ====================

    @Operation(summary = "获取点赞列表")
    @GetMapping("/like/list")
    public Result<IPage<UmsLike>> getLikeList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String targetType,
            @RequestParam(required = false) Long targetId) {

        Page<UmsLike> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<UmsLike> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(targetType)) wrapper.eq(UmsLike::getTargetType, targetType);
        if (targetId != null) wrapper.eq(UmsLike::getTargetId, targetId);
        wrapper.orderByDesc(UmsLike::getCreateTime);

        return Result.success(likeService.page(pageParam, wrapper));
    }

    @Operation(summary = "删除点赞")
    @DeleteMapping("/like/{id}")
    public Result<String> deleteLike(@PathVariable Long id) {
        likeService.removeById(id);
        return Result.success("点赞已删除");
    }

    @Operation(summary = "批量删除点赞")
    @DeleteMapping("/like/batch")
    public Result<String> batchDeleteLikes(@RequestBody List<Long> ids) {
        likeService.removeByIds(ids);
        return Result.success("已删除 " + ids.size() + " 条点赞记录");
    }

    // ==================== 收藏管理 ====================

    @Operation(summary = "获取收藏列表")
    @GetMapping("/favorite/list")
    public Result<IPage<UmsFavorite>> getFavoriteList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String targetType,
            @RequestParam(required = false) Long userId) {

        Page<UmsFavorite> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<UmsFavorite> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(targetType)) wrapper.eq(UmsFavorite::getTargetType, targetType);
        if (userId != null) wrapper.eq(UmsFavorite::getUserId, userId);
        wrapper.orderByDesc(UmsFavorite::getCreateTime);

        return Result.success(favoriteService.page(pageParam, wrapper));
    }

    @Operation(summary = "删除收藏")
    @DeleteMapping("/favorite/{id}")
    public Result<String> deleteFavorite(@PathVariable Long id) {
        favoriteService.removeById(id);
        return Result.success("收藏已删除");
    }

    @Operation(summary = "批量删除收藏")
    @DeleteMapping("/favorite/batch")
    public Result<String> batchDeleteFavorites(@RequestBody List<Long> ids) {
        favoriteService.removeByIds(ids);
        return Result.success("已删除 " + ids.size() + " 条收藏记录");
    }

    // ==================== 分享管理 ====================

    @Operation(summary = "获取分享列表")
    @GetMapping("/share/list")
    public Result<IPage<UmsShare>> getShareList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String targetType,
            @RequestParam(required = false) String platform) {

        Page<UmsShare> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<UmsShare> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(targetType)) wrapper.eq(UmsShare::getTargetType, targetType);
        if (StringUtils.hasText(platform)) wrapper.eq(UmsShare::getPlatform, platform);
        wrapper.orderByDesc(UmsShare::getCreateTime);

        return Result.success(shareService.page(pageParam, wrapper));
    }

    @Operation(summary = "删除分享记录")
    @DeleteMapping("/share/{id}")
    public Result<String> deleteShare(@PathVariable Long id) {
        shareService.removeById(id);
        return Result.success("分享记录已删除");
    }

    @Operation(summary = "批量删除分享记录")
    @DeleteMapping("/share/batch")
    public Result<String> batchDeleteShares(@RequestBody List<Long> ids) {
        shareService.removeByIds(ids);
        return Result.success("已删除 " + ids.size() + " 条分享记录");
    }

    // ==================== 统计数据 ====================

    @Operation(summary = "获取交互统计数据")
    @GetMapping("/stats")
    public Result<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalComments", commentService.count());
        stats.put("totalLikes", likeService.count());
        stats.put("totalFavorites", favoriteService.count());
        stats.put("totalShares", shareService.count());
        
        // 按类型统计
        stats.put("productLikes", likeService.count(new LambdaQueryWrapper<UmsLike>().eq(UmsLike::getTargetType, "product")));
        stats.put("productFavorites", favoriteService.count(new LambdaQueryWrapper<UmsFavorite>().eq(UmsFavorite::getTargetType, "product")));
        
        return Result.success(stats);
    }
}
