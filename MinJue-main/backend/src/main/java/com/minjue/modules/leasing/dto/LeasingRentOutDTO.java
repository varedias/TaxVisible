package com.minjue.modules.leasing.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 租赁设备租出参数
 */
@Data
public class LeasingRentOutDTO {

    /** 承租企业 */
    private String companyName;

    /** 联系人 */
    private String contactName;

    /** 联系电话 */
    private String contactPhone;

    /** 配送地址 */
    private String deliveryAddress;

    /** 使用地址 */
    private String onsiteAddress;

    /** 开始日期 */
    private LocalDate leaseStartDate;

    /** 预计收回日期 */
    private LocalDate expectedReturnDate;

    /** 租赁周期 */
    private String leasePeriod;

    /** 租赁时长 */
    private Integer leaseDuration;

    /** 租赁金额 */
    private BigDecimal rentalAmount;

    /** 备注 */
    private String remark;
}
