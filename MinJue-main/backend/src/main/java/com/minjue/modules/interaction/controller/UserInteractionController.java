package com.minjue.modules.interaction.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.minjue.common.result.Result;
import com.minjue.modules.interaction.entity.*;
import com.minjue.modules.interaction.service.*;
import com.minjue.modules.system.entity.SysUser;
import com.minjue.modules.system.service.SysUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Tag(name = "User Interaction", description = "用户端交互接口（评论/点赞/收藏/分享）")
@RestController
@RequestMapping("/api/v1/interaction")
@RequiredArgsConstructor
public class UserInteractionController {

    private final CommentService commentService;
    private final LikeService likeService;
    private final FavoriteService favoriteService;
    private final ShareService shareService;
    private final SysUserService sysUserService;

    // ==================== 辅助方法 ====================

    private SysUser getCurrentUser(Principal principal) {
        if (principal == null) return null;
        return sysUserService.getOne(
                new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, principal.getName()));
    }

    // ==================== 评论 ====================

    @Operation(summary = "获取商品评论列表")
    @GetMapping("/comment/list")
    public Result<?> getCommentList(
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        IPage<PmsComment> result = commentService.getCommentsByProductId(productId, page, size);
        return Result.success(result);
    }

    @Operation(summary = "获取商品评论数量")
    @GetMapping("/comment/count")
    public Result<Long> getCommentCount(@RequestParam Long productId) {
        long count = commentService.countByProductId(productId);
        return Result.success(count);
    }

    @Operation(summary = "发表评论")
    @PostMapping("/comment")
    public Result<?> addComment(@RequestBody Map<String, Object> params, Principal principal) {
        SysUser user = getCurrentUser(principal);
        if (user == null) return Result.error(401, "请先登录");

        Long productId = Long.valueOf(params.get("productId").toString());
        Integer rating = params.get("rating") != null ? Integer.valueOf(params.get("rating").toString()) : 5;
        String content = (String) params.get("content");
        String images = (String) params.get("images");

        if (content == null || content.trim().isEmpty()) {
            return Result.error("评论内容不能为空");
        }

        PmsComment comment = commentService.addComment(
                user.getId(), user.getNickname() != null ? user.getNickname() : user.getUsername(),
                user.getAvatar(), productId, rating, content, images);
        return Result.success(comment);
    }

    @Operation(summary = "删除自己的评论")
    @DeleteMapping("/comment/{id}")
    public Result<?> deleteComment(@PathVariable Long id, Principal principal) {
        SysUser user = getCurrentUser(principal);
        if (user == null) return Result.error(401, "请先登录");

        boolean deleted = commentService.deleteComment(id, user.getId());
        return deleted ? Result.success("删除成功") : Result.error("删除失败，评论不存在或无权限");
    }

    @Operation(summary = "评论点赞（有用）")
    @PostMapping("/comment/{id}/helpful")
    public Result<?> helpfulComment(@PathVariable Long id) {
        boolean result = commentService.helpfulComment(id);
        return result ? Result.success("操作成功") : Result.error("评论不存在");
    }

    // ==================== 点赞 ====================

    @Operation(summary = "切换点赞状态")
    @PostMapping("/like/toggle")
    public Result<?> toggleLike(@RequestBody Map<String, Object> params, Principal principal) {
        SysUser user = getCurrentUser(principal);
        if (user == null) return Result.error(401, "请先登录");

        Long targetId = Long.valueOf(params.get("targetId").toString());
        String targetType = (String) params.get("targetType");

        boolean liked = likeService.toggleLike(user.getId(), targetId, targetType);
        Map<String, Object> data = new HashMap<>();
        data.put("liked", liked);
        data.put("count", likeService.countLikes(targetId, targetType));
        return Result.success(data);
    }

    @Operation(summary = "检查是否已点赞")
    @GetMapping("/like/check")
    public Result<?> checkLike(
            @RequestParam Long targetId,
            @RequestParam String targetType,
            Principal principal) {
        SysUser user = getCurrentUser(principal);
        if (user == null) return Result.success(false);

        boolean liked = likeService.isLiked(user.getId(), targetId, targetType);
        return Result.success(liked);
    }

    @Operation(summary = "获取点赞数")
    @GetMapping("/like/count")
    public Result<Long> getLikeCount(
            @RequestParam Long targetId,
            @RequestParam String targetType) {
        long count = likeService.countLikes(targetId, targetType);
        return Result.success(count);
    }

    // ==================== 收藏 ====================

    @Operation(summary = "切换收藏状态")
    @PostMapping("/favorite/toggle")
    public Result<?> toggleFavorite(@RequestBody Map<String, Object> params, Principal principal) {
        SysUser user = getCurrentUser(principal);
        if (user == null) return Result.error(401, "请先登录");

        Long targetId = Long.valueOf(params.get("targetId").toString());
        String targetType = (String) params.get("targetType");
        String targetName = (String) params.getOrDefault("targetName", "");
        String targetImage = (String) params.getOrDefault("targetImage", "");

        boolean favorited = favoriteService.toggleFavorite(
                user.getId(), targetId, targetType, targetName, targetImage);
        Map<String, Object> data = new HashMap<>();
        data.put("favorited", favorited);
        data.put("count", favoriteService.countFavorites(targetId, targetType));
        return Result.success(data);
    }

    @Operation(summary = "检查是否已收藏")
    @GetMapping("/favorite/check")
    public Result<?> checkFavorite(
            @RequestParam Long targetId,
            @RequestParam String targetType,
            Principal principal) {
        SysUser user = getCurrentUser(principal);
        if (user == null) return Result.success(false);

        boolean favorited = favoriteService.isFavorited(user.getId(), targetId, targetType);
        return Result.success(favorited);
    }

    @Operation(summary = "获取用户收藏列表")
    @GetMapping("/favorite/list")
    public Result<?> getUserFavorites(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String targetType,
            Principal principal) {
        SysUser user = getCurrentUser(principal);
        if (user == null) return Result.error(401, "请先登录");

        IPage<UmsFavorite> result;
        if (targetType != null && !targetType.isEmpty()) {
            result = favoriteService.getUserFavoritesByType(user.getId(), targetType, page, size);
        } else {
            result = favoriteService.getUserFavorites(user.getId(), page, size);
        }
        return Result.success(result);
    }

    // ==================== 分享 ====================

    @Operation(summary = "记录分享")
    @PostMapping("/share")
    public Result<?> addShare(@RequestBody Map<String, Object> params, Principal principal) {
        SysUser user = getCurrentUser(principal);
        if (user == null) return Result.error(401, "请先登录");

        Long targetId = Long.valueOf(params.get("targetId").toString());
        String targetType = (String) params.get("targetType");
        String targetName = (String) params.getOrDefault("targetName", "");
        String shareUrl = (String) params.getOrDefault("shareUrl", "");
        String platform = (String) params.getOrDefault("platform", "link");

        UmsShare share = shareService.addShare(
                user.getId(), targetId, targetType, targetName, shareUrl, platform);
        return Result.success(share);
    }

    @Operation(summary = "获取分享数")
    @GetMapping("/share/count")
    public Result<Long> getShareCount(
            @RequestParam Long targetId,
            @RequestParam String targetType) {
        long count = shareService.countShares(targetId, targetType);
        return Result.success(count);
    }

    // ==================== 批量状态查询（优化前端请求数） ====================

    @Operation(summary = "批量查询交互状态（点赞/收藏）")
    @GetMapping("/status")
    public Result<?> getInteractionStatus(
            @RequestParam Long targetId,
            @RequestParam String targetType,
            Principal principal) {
        Map<String, Object> data = new HashMap<>();
        data.put("likeCount", likeService.countLikes(targetId, targetType));
        data.put("favoriteCount", favoriteService.countFavorites(targetId, targetType));
        data.put("shareCount", shareService.countShares(targetId, targetType));

        SysUser user = getCurrentUser(principal);
        if (user != null) {
            data.put("liked", likeService.isLiked(user.getId(), targetId, targetType));
            data.put("favorited", favoriteService.isFavorited(user.getId(), targetId, targetType));
        } else {
            data.put("liked", false);
            data.put("favorited", false);
        }
        return Result.success(data);
    }
}
