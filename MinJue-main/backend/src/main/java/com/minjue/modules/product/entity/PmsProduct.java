package com.minjue.modules.product.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 商品实体
 */
@Data
@TableName("pms_product")
public class PmsProduct implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 供应商ID */
    private Long supplierId;

    /** 分类ID */
    private Long categoryId;

    /** 商品名称 */
    private String name;

    /** 价格 */
    private BigDecimal price;

    /** 原价 */
    private BigDecimal originalPrice;

    /** 库存 */
    private Integer stock;

    /** 主图 */
    private String image;

    /** 相册 (JSON) */
    private String album;

    /** 描述 */
    private String description;

    /** 规格参数 (JSON) */
    private String specs;

    /** 状态: 1-上架, 0-下架 */
    private Integer status;

    /** 销量 */
    private Integer sales;

    /** 浏览量 */
    private Integer views;

    /** 创建时间 */
    private LocalDateTime createTime;
}
