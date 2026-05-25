package com.minjue.modules.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.order.entity.OmsOrder;
import com.minjue.modules.order.entity.OmsOrderItem;
import com.minjue.modules.order.mapper.OmsOrderItemMapper;
import com.minjue.modules.order.service.OmsOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 管理后台 - 订单管理
 */
@Tag(name = "Admin Order Management")
@RestController
@RequestMapping("/api/admin/order")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OmsOrderService orderService;
    private final OmsOrderItemMapper orderItemMapper;

    @Operation(summary = "获取订单列表")
    @GetMapping("/list")
    public Result<IPage<OmsOrder>> getOrderList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) Integer status) {

        Page<OmsOrder> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<OmsOrder> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(orderNo)) {
            wrapper.like(OmsOrder::getOrderNo, orderNo);
        }
        if (status != null) {
            wrapper.eq(OmsOrder::getStatus, status);
        }
        wrapper.orderByDesc(OmsOrder::getCreateTime);

        return Result.success(orderService.page(pageParam, wrapper));
    }

    @Operation(summary = "获取订单详情")
    @GetMapping("/{id}")
    public Result<Map<String, Object>> getOrderDetail(@PathVariable Long id) {
        OmsOrder order = orderService.getById(id);
        if (order == null) {
            return Result.error(404, "订单不存在");
        }
        List<OmsOrderItem> items = orderItemMapper.selectList(
                new LambdaQueryWrapper<OmsOrderItem>().eq(OmsOrderItem::getOrderId, id));

        Map<String, Object> result = new HashMap<>();
        result.put("order", order);
        result.put("items", items);
        return Result.success(result);
    }

    @Operation(summary = "更新订单状态")
    @PutMapping("/{id}/status")
    public Result<String> updateOrderStatus(@PathVariable Long id, @RequestParam Integer status) {
        OmsOrder order = orderService.getById(id);
        if (order == null) {
            return Result.error(404, "订单不存在");
        }
        order.setStatus(status);
        order.setUpdateTime(LocalDateTime.now());
        orderService.updateById(order);

        String[] statusNames = {"待付款", "待发货", "已发货", "已完成", "已取消"};
        return Result.success("订单状态已更新为: " + (status < statusNames.length ? statusNames[status] : "未知"));
    }

    @Operation(summary = "删除订单")
    @DeleteMapping("/{id}")
    public Result<String> deleteOrder(@PathVariable Long id) {
        // 先删除订单项
        orderItemMapper.delete(new LambdaQueryWrapper<OmsOrderItem>().eq(OmsOrderItem::getOrderId, id));
        // 再删除订单
        orderService.removeById(id);
        return Result.success("订单已删除");
    }

    @Operation(summary = "批量删除订单")
    @DeleteMapping("/batch")
    public Result<String> batchDeleteOrders(@RequestBody List<Long> ids) {
        for (Long id : ids) {
            orderItemMapper.delete(new LambdaQueryWrapper<OmsOrderItem>().eq(OmsOrderItem::getOrderId, id));
        }
        orderService.removeByIds(ids);
        return Result.success("已删除 " + ids.size() + " 个订单");
    }

    @Operation(summary = "获取订单统计")
    @GetMapping("/stats")
    public Result<Map<String, Object>> getOrderStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", orderService.count());
        stats.put("pending", orderService.count(new LambdaQueryWrapper<OmsOrder>().eq(OmsOrder::getStatus, 0)));
        stats.put("paid", orderService.count(new LambdaQueryWrapper<OmsOrder>().eq(OmsOrder::getStatus, 1)));
        stats.put("shipped", orderService.count(new LambdaQueryWrapper<OmsOrder>().eq(OmsOrder::getStatus, 2)));
        stats.put("completed", orderService.count(new LambdaQueryWrapper<OmsOrder>().eq(OmsOrder::getStatus, 3)));
        stats.put("cancelled", orderService.count(new LambdaQueryWrapper<OmsOrder>().eq(OmsOrder::getStatus, 4)));
        return Result.success(stats);
    }
}
