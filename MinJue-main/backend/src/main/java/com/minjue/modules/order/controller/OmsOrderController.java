package com.minjue.modules.order.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.minjue.common.result.Result;
import com.minjue.modules.order.dto.CreateOrderDTO;
import com.minjue.modules.order.dto.DirectOrderDTO;
import com.minjue.modules.order.entity.OmsOrder;
import com.minjue.modules.order.entity.OmsOrderItem;
import com.minjue.modules.order.service.OmsOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Order Management")
@RestController
@RequestMapping("/api/v1/order")
@RequiredArgsConstructor
public class OmsOrderController {

    private final OmsOrderService orderService;

    // 临时用户ID (实际应从 JWT 解析)
    private Long getUserId(Principal principal) {
        // TODO: 从 principal 获取真实用户ID
        return 1L;
    }

    @Operation(summary = "Create Order from Cart")
    @PostMapping("/create")
    public Result<String> createOrder(Principal principal, @RequestBody CreateOrderDTO dto) {
        String orderNo = orderService.createOrder(getUserId(principal), dto);
        return Result.success(orderNo);
    }

    @Operation(summary = "Direct Order (without cart)")
    @PostMapping("/direct")
    public Result<String> directOrder(Principal principal, @RequestBody DirectOrderDTO dto) {
        String orderNo = orderService.createDirectOrder(getUserId(principal), dto);
        return Result.success(orderNo);
    }

    @Operation(summary = "Get User Orders")
    @GetMapping("/list")
    public Result<Page<OmsOrder>> getUserOrders(
            Principal principal,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status) {
        return Result.success(orderService.getUserOrders(getUserId(principal), page, size, status));
    }

    @Operation(summary = "Get Order Detail")
    @GetMapping("/{orderId}")
    public Result<Map<String, Object>> getOrderDetail(@PathVariable Long orderId) {
        OmsOrder order = orderService.getOrderDetail(orderId);
        List<OmsOrderItem> items = orderService.getOrderItems(orderId);

        Map<String, Object> result = new HashMap<>();
        result.put("order", order);
        result.put("items", items);
        return Result.success(result);
    }

    @Operation(summary = "Pay Order (Simulated)")
    @PostMapping("/pay/{orderId}")
    public Result<String> payOrder(@PathVariable Long orderId) {
        orderService.payOrder(orderId);
        return Result.success("Payment successful");
    }

    @Operation(summary = "Cancel Order")
    @PostMapping("/cancel/{orderId}")
    public Result<String> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return Result.success("Order cancelled");
    }
}
