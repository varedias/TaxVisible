package com.minjue.modules.order.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 直接下单请求 DTO（不需要购物车）
 */
@Data
public class DirectOrderDTO {

    /** 商品ID */
    private Long productId;

    /** 商品名称 */
    private String productName;

    /** 商品图片 */
    private String productImage;

    /** 商品价格 */
    private BigDecimal productPrice;

    /** 购买数量 */
    private Integer quantity;

    /** 收货地址 */
    private String address;

    /** 收货人姓名 */
    private String receiverName;

    /** 收货人电话 */
    private String receiverPhone;

    /** 备注 */
    private String remark;
}
