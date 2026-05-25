package com.minjue.modules.order.dto;

import lombok.Data;
import java.util.List;

/**
 * 创建订单请求 DTO
 */
@Data
public class CreateOrderDTO {

    /** 购物车中选中的商品ID列表 */
    private List<Long> productIds;

    /** 收货地址 (简化处理) */
    private String address;

    /** 收货人姓名 */
    private String receiverName;

    /** 收货人电话 */
    private String receiverPhone;

    /** 备注 */
    private String remark;
}
