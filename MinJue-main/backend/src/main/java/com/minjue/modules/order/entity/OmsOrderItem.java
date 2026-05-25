package com.minjue.modules.order.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 订单项实体 (订单中的每个商品)
 */
@Data
@TableName("oms_order_item")
public class OmsOrderItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 订单ID */
    private Long orderId;

    /** 商品ID */
    private Long productId;

    /** 商品名称 (快照) */
    private String productName;

    /** 商品图片 (快照) */
    private String productImage;

    /** 商品价格 (快照) */
    private BigDecimal productPrice;

    /** 购买数量 */
    private Integer quantity;

    /** 小计金额 */
    private BigDecimal subtotal;
}
