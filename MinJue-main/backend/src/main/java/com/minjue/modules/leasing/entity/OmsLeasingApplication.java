package com.minjue.modules.leasing.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 租赁申请实体
 */
@Data
@TableName("oms_leasing_application")
public class OmsLeasingApplication implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 租赁设备ID */
    private Long leasingId;

    /** 申请用户ID */
    private Long userId;

    /** 租赁类型: FINANCIAL/OPERATING */
    private String leaseType;

    /** 租赁周期: DAY/WEEK/MONTH */
    private String leasePeriod;

    /** 租赁时长 */
    private Integer leaseDuration;

    /** 预估费用 */
    private BigDecimal estimatedCost;

    /** 企业名称 */
    private String companyName;

    /** 联系人 */
    private String contactName;

    /** 联系电话 */
    private String contactPhone;

    /** 配送地址 */
    private String deliveryAddress;

    /** 使用地址 */
    private String onsiteAddress;

    /** 期望开始日期 */
    private LocalDate expectedStartDate;

    /** 备注 */
    private String remark;

    /** 状态: 0-待审核 1-已通过 2-已驳回 */
    private Integer status;

    /** 创建时间 */
    private LocalDateTime createTime;

    /** 更新时间 */
    private LocalDateTime updateTime;
}
