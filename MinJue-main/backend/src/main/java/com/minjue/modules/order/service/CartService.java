package com.minjue.modules.order.service;

import com.minjue.modules.order.dto.CartItemDTO;
import com.minjue.modules.product.entity.PmsProduct;
import com.minjue.modules.product.service.PmsProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 购物车服务 (基于 Redis)
 */
@Service
@RequiredArgsConstructor
public class CartService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final PmsProductService productService;

    private static final String CART_KEY_PREFIX = "cart:user:";
    private static final long CART_EXPIRE_DAYS = 30;

    /**
     * 获取购物车 Key
     */
    private String getCartKey(Long userId) {
        return CART_KEY_PREFIX + userId;
    }

    /**
     * 添加商品到购物车
     */
    public void addToCart(Long userId, Long productId, Integer quantity) {
        String cartKey = getCartKey(userId);
        String itemKey = productId.toString();

        // 获取商品信息
        PmsProduct product = productService.getById(productId);
        if (product == null) {
            throw new RuntimeException("商品不存在");
        }

        // 检查是否已存在
        CartItemDTO existingItem = (CartItemDTO) redisTemplate.opsForHash().get(cartKey, itemKey);
        if (existingItem != null) {
            // 已存在，增加数量
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            redisTemplate.opsForHash().put(cartKey, itemKey, existingItem);
        } else {
            // 不存在，新增
            CartItemDTO cartItem = new CartItemDTO();
            cartItem.setProductId(productId);
            cartItem.setProductName(product.getName());
            cartItem.setProductImage(product.getImage());
            cartItem.setProductPrice(product.getPrice());
            cartItem.setQuantity(quantity);
            cartItem.setChecked(true);
            redisTemplate.opsForHash().put(cartKey, itemKey, cartItem);
        }

        // 设置过期时间
        redisTemplate.expire(cartKey, CART_EXPIRE_DAYS, TimeUnit.DAYS);
    }

    /**
     * 获取购物车列表
     */
    public List<CartItemDTO> getCartItems(Long userId) {
        String cartKey = getCartKey(userId);
        Map<Object, Object> entries = redisTemplate.opsForHash().entries(cartKey);
        List<CartItemDTO> items = new ArrayList<>();
        for (Object value : entries.values()) {
            if (value instanceof CartItemDTO) {
                items.add((CartItemDTO) value);
            }
        }
        return items;
    }

    /**
     * 更新购物车商品数量
     */
    public void updateQuantity(Long userId, Long productId, Integer quantity) {
        String cartKey = getCartKey(userId);
        String itemKey = productId.toString();

        CartItemDTO item = (CartItemDTO) redisTemplate.opsForHash().get(cartKey, itemKey);
        if (item != null) {
            item.setQuantity(quantity);
            redisTemplate.opsForHash().put(cartKey, itemKey, item);
        }
    }

    /**
     * 删除购物车商品
     */
    public void removeFromCart(Long userId, Long productId) {
        String cartKey = getCartKey(userId);
        redisTemplate.opsForHash().delete(cartKey, productId.toString());
    }

    /**
     * 清空购物车
     */
    public void clearCart(Long userId) {
        redisTemplate.delete(getCartKey(userId));
    }

    /**
     * 删除购物车中指定的商品列表
     */
    public void removeItems(Long userId, List<Long> productIds) {
        String cartKey = getCartKey(userId);
        for (Long productId : productIds) {
            redisTemplate.opsForHash().delete(cartKey, productId.toString());
        }
    }
}
