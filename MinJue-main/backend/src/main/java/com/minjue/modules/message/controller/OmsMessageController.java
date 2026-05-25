package com.minjue.modules.message.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.message.entity.OmsMessage;
import com.minjue.modules.message.service.OmsMessageService;
import com.minjue.modules.system.entity.SysUser;
import com.minjue.modules.system.service.SysUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 即时消息 Controller
 */
@Tag(name = "Message API")
@RestController
@RequestMapping("/api/v1/message")
@RequiredArgsConstructor
public class OmsMessageController {

    private final OmsMessageService messageService;
    private final SysUserService sysUserService;

    @Operation(summary = "发送消息")
    @PostMapping("/send")
    public Result<OmsMessage> send(@RequestBody OmsMessage message, Principal principal) {
        if (principal == null) {
            return Result.error(401, "请先登录");
        }
        SysUser user = sysUserService.getOne(
                new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, principal.getName()));
        if (user == null) {
            return Result.error(401, "用户不存在");
        }

        message.setSenderId(user.getId());
        message.setIsRead(false);
        message.setCreateTime(LocalDateTime.now());

        // 判断发送者是否为供应商
        if ("SUPPLIER".equals(user.getRole())) {
            message.setIsFromSupplier(true);
        } else {
            message.setIsFromSupplier(false);
        }

        if (message.getMessageType() == null) {
            message.setMessageType("TEXT");
        }

        messageService.save(message);
        return Result.success(message);
    }

    @Operation(summary = "获取与某供应商的聊天记录")
    @GetMapping("/history/{supplierId}")
    public Result<List<OmsMessage>> history(
            @PathVariable Long supplierId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "50") Integer size,
            Principal principal) {
        if (principal == null) {
            return Result.error(401, "请先登录");
        }
        SysUser user = sysUserService.getOne(
                new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, principal.getName()));
        if (user == null) {
            return Result.error(401, "用户不存在");
        }

        LambdaQueryWrapper<OmsMessage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(OmsMessage::getSupplierId, supplierId);
        // 查询当前用户与该供应商之间的所有消息
        wrapper.and(w -> w.eq(OmsMessage::getSenderId, user.getId())
                .or().eq(OmsMessage::getReceiverId, user.getId()));
        wrapper.orderByAsc(OmsMessage::getCreateTime);
        wrapper.last("LIMIT " + (page - 1) * size + ", " + size);

        List<OmsMessage> messages = messageService.list(wrapper);
        return Result.success(messages);
    }

    @Operation(summary = "获取消息会话列表（供应商端）")
    @GetMapping("/conversations")
    public Result<?> conversations(Principal principal) {
        if (principal == null) {
            return Result.error(401, "请先登录");
        }
        SysUser user = sysUserService.getOne(
                new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, principal.getName()));
        if (user == null) {
            return Result.error(401, "用户不存在");
        }

        // 查询涉及此用户的所有消息，按供应商分组获取最后一条消息
        // 简化实现：获取用户相关的所有最新消息
        LambdaQueryWrapper<OmsMessage> wrapper = new LambdaQueryWrapper<>();
        wrapper.and(w -> w.eq(OmsMessage::getSenderId, user.getId())
                .or().eq(OmsMessage::getReceiverId, user.getId()));
        wrapper.orderByDesc(OmsMessage::getCreateTime);
        wrapper.last("LIMIT 50");

        List<OmsMessage> messages = messageService.list(wrapper);
        return Result.success(messages);
    }

    @Operation(summary = "标记消息已读")
    @PostMapping("/read/{supplierId}")
    public Result<String> markRead(@PathVariable Long supplierId, Principal principal) {
        if (principal == null) {
            return Result.error(401, "请先登录");
        }
        SysUser user = sysUserService.getOne(
                new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, principal.getName()));
        if (user == null) {
            return Result.error(401, "用户不存在");
        }

        // 标记该供应商发给当前用户的未读消息为已读
        LambdaUpdateWrapper<OmsMessage> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(OmsMessage::getSupplierId, supplierId)
                .eq(OmsMessage::getReceiverId, user.getId())
                .eq(OmsMessage::getIsRead, false)
                .set(OmsMessage::getIsRead, true);
        messageService.update(wrapper);

        return Result.success("已标记已读");
    }

    @Operation(summary = "获取未读消息数")
    @GetMapping("/unread-count")
    public Result<Long> unreadCount(Principal principal) {
        if (principal == null) {
            return Result.error(401, "请先登录");
        }
        SysUser user = sysUserService.getOne(
                new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, principal.getName()));
        if (user == null) {
            return Result.error(401, "用户不存在");
        }

        long count = messageService.count(
                new LambdaQueryWrapper<OmsMessage>()
                        .eq(OmsMessage::getReceiverId, user.getId())
                        .eq(OmsMessage::getIsRead, false)
        );
        return Result.success(count);
    }
}
