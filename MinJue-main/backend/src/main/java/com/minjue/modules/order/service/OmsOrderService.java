package com.minjue.modules.order.service;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.minjue.common.exception.CustomException;
import com.minjue.modules.order.dto.CartItemDTO;
import com.minjue.modules.order.dto.CreateOrderDTO;
import com.minjue.modules.order.dto.DirectOrderDTO;
import com.minjue.modules.order.entity.OmsOrder;
import com.minjue.modules.order.entity.OmsOrderItem;
import com.minjue.modules.order.mapper.OmsOrderItemMapper;
import com.minjue.modules.order.mapper.OmsOrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单服务
 */
@Service
@RequiredArgsConstructor
public class OmsOrderService extends ServiceImpl<OmsOrderMapper, OmsOrder> {

    private final OmsOrderItemMapper orderItemMapper;
    private final CartService cartService;

    /**
     * 创建订单
     */
    @Transactional(rollbackFor = Exception.class)
    public String createOrder(Long userId, CreateOrderDTO dto) {
        // 从购物车获取选中的商品
        List<CartItemDTO> cartItems = cartService.getCartItems(userId);

        // 筛选出下单的商品
        List<CartItemDTO> orderItems = cartItems.stream()
                .filter(item -> dto.getProductIds().contains(item.getProductId()))
                .toList();

        if (orderItems.isEmpty()) {
            throw new CustomException("请选择要购买的商品");
        }

        // 计算总金额
        BigDecimal totalAmount = orderItems.stream()
                .map(item -> item.getProductPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 生成订单号
        String orderNo = IdUtil.getSnowflakeNextIdStr();

        // 创建订单
        OmsOrder order = new OmsOrder();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setStatus(0); // 待付款
        order.setCreateTime(LocalDateTime.now());
        save(order);

        // 创建订单项
        for (CartItemDTO cartItem : orderItems) {
            OmsOrderItem orderItem = new OmsOrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setProductName(cartItem.getProductName());
            orderItem.setProductImage(cartItem.getProductImage());
            orderItem.setProductPrice(cartItem.getProductPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSubtotal(cartItem.getProductPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            orderItemMapper.insert(orderItem);
        }

        // 清除购物车中已下单的商品
        cartService.removeItems(userId, dto.getProductIds());

        return orderNo;
    }

    /**
     * 直接下单（不需要购物车）
     */
    @Transactional(rollbackFor = Exception.class)
    public String createDirectOrder(Long userId, DirectOrderDTO dto) {
        if (dto.getProductId() == null) {
            throw new CustomException("请选择要购买的商品");
        }
        if (dto.getQuantity() == null || dto.getQuantity() <= 0) {
            dto.setQuantity(1);
        }

        // 计算总金额
        BigDecimal totalAmount = dto.getProductPrice().multiply(BigDecimal.valueOf(dto.getQuantity()));

        // 生成订单号
        String orderNo = IdUtil.getSnowflakeNextIdStr();

        // 创建订单
        OmsOrder order = new OmsOrder();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setTotalAmount(totalAmount);
        order.setStatus(0); // 待付款
        order.setCreateTime(LocalDateTime.now());
        save(order);

        // 创建订单项
        OmsOrderItem orderItem = new OmsOrderItem();
        orderItem.setOrderId(order.getId());
        orderItem.setProductId(dto.getProductId());
        orderItem.setProductName(dto.getProductName());
        orderItem.setProductImage(dto.getProductImage());
        orderItem.setProductPrice(dto.getProductPrice());
        orderItem.setQuantity(dto.getQuantity());
        orderItem.setSubtotal(totalAmount);
        orderItemMapper.insert(orderItem);

        return orderNo;
    }

    /**
     * 获取用户订单列表
     */
    public Page<OmsOrder> getUserOrders(Long userId, Integer page, Integer size, Integer status) {
        LambdaQueryWrapper<OmsOrder> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(OmsOrder::getUserId, userId);
        if (status != null && status >= 0) {
            wrapper.eq(OmsOrder::getStatus, status);
        }
        wrapper.orderByDesc(OmsOrder::getCreateTime);
        return page(new Page<>(page, size), wrapper);
    }

    /**
     * 获取订单详情 (含订单项)
     */
    public OmsOrder getOrderDetail(Long orderId) {
        return getById(orderId);
    }

    /**
     * 获取订单项列表
     */
    public List<OmsOrderItem> getOrderItems(Long orderId) {
        return orderItemMapper.selectList(
                new LambdaQueryWrapper<OmsOrderItem>().eq(OmsOrderItem::getOrderId, orderId));
    }

    /**
     * 模拟支付
     */
    @Transactional(rollbackFor = Exception.class)
    public void payOrder(Long orderId) {
        OmsOrder order = getById(orderId);
        if (order == null) {
            throw new CustomException("订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new CustomException("订单状态异常");
        }
        order.setStatus(1); // 待发货
        order.setPayTime(LocalDateTime.now());
        updateById(order);
    }

    /**
     * 取消订单
     */
    @Transactional(rollbackFor = Exception.class)
    public void cancelOrder(Long orderId) {
        OmsOrder order = getById(orderId);
        if (order == null) {
            throw new CustomException("订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new CustomException("只有待付款订单可以取消");
        }
        order.setStatus(4); // 已取消
        updateById(order);
    }
}
