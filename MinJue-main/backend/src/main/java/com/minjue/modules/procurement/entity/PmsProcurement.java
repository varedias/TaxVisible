package com.minjue.modules.procurement.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 采购需求实体
 */
@Data
@TableName("pms_procurement")
public class PmsProcurement implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 采购标题 */
    private String title;

    /** 采购描述 */
    private String description;

    /** 设备分类ID */
    private Long categoryId;

    /** 预算下限 */
    private BigDecimal budgetMin;

    /** 预算上限 */
    private BigDecimal budgetMax;

    /** 需求数量 */
    private Integer quantity;

    /** 截止日期 */
    private LocalDate deadline;

    /** 联系人 */
    private String contactName;

    /** 联系电话 */
    private String contactPhone;

    /** 发布用户ID */
    private Long userId;

    /** 状态: 1-进行中 2-已完成 3-已关闭 */
    private Integer status;

    /** 创建时间 */
    private LocalDateTime createTime;

    /** 更新时间 */
    private LocalDateTime updateTime;
}
