package com.minjue.modules.order.dto;

import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 购物车项 DTO (存储在 Redis 中)
 */
@Data
public class CartItemDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 商品ID */
    private Long productId;

    /** 商品名称 */
    private String productName;

    /** 商品图片 */
    private String productImage;

    /** 商品价格 */
    private BigDecimal productPrice;

    /** 数量 */
    private Integer quantity;

    /** 是否选中 */
    private Boolean checked;
}
