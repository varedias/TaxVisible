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
 * 租赁设备实体
 */
@Data
@TableName("oms_leasing")
public class OmsLeasing implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 设备名称 */
    private String name;

    /** 租赁类型: financing-融资租赁, operating-经营租赁 */
    private String type;

    /** 设备图片URL */
    private String image;

    /** 设备描述 */
    private String description;

    /** 供应商名称 */
    private String supplier;

    /** 供应商ID */
    private Long supplierId;

    /** 仓库/设备所在地 */
    private String warehouseAddress;

    /** 月租金 */
    private BigDecimal monthlyPrice;

    /** 设备总价(融资租赁) */
    private BigDecimal totalPrice;

    /** 租期 */
    private String duration;

    /** 日租金(经营租赁) */
    private BigDecimal dailyPrice;

    /** 周租金(经营租赁) */
    private BigDecimal weeklyPrice;

    /** 服务优势(JSON数组) */
    private String benefits;

    /** 标签(JSON数组) */
    private String tags;

    /** 已租次数 */
    private Integer leased;

    /** 评分 */
    private BigDecimal rating;

    /** 状态: 1-上架, 0-下架 */
    private Integer status;

    /** 库存状态: 0-待租, 1-已租出 */
    private Integer inventoryStatus;

    /** 当前承租企业 */
    private String lesseeCompany;

    /** 当前联系人 */
    private String lesseeContactName;

    /** 当前联系电话 */
    private String lesseeContactPhone;

    /** 配送地址 */
    private String deliveryAddress;

    /** 使用地址 */
    private String onsiteAddress;

    /** 当前租赁开始日期 */
    private LocalDate leaseStartDate;

    /** 预计收回日期 */
    private LocalDate expectedReturnDate;

    /** 当前租赁周期 */
    private String currentLeasePeriod;

    /** 当前租赁时长 */
    private Integer currentLeaseDuration;

    /** 当前租赁金额 */
    private BigDecimal currentRentalAmount;

    /** 当前租赁备注 */
    private String rentalRemark;

    /** 最近收回地址 */
    private String returnAddress;

    /** 最近收回接收人 */
    private String returnReceiverName;

    /** 设备收回状态 */
    private String equipmentCondition;

    /** 收回备注 */
    private String returnNote;

    /** 收回日期 */
    private LocalDate returnDate;

    /** 创建时间 */
    private LocalDateTime createTime;

    /** 更新时间 */
    private LocalDateTime updateTime;
}
