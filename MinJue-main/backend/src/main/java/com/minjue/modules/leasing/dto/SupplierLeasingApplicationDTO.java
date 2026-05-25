package com.minjue.modules.leasing.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 供应商侧租赁申请视图
 */
@Data
public class SupplierLeasingApplicationDTO {

    private Long id;
    private Long leasingId;
    private String leasingName;
    private String leasingType;
    private String leasingImage;
    private Long supplierId;
    private String supplierName;
    private Integer inventoryStatus;
    private String leaseType;
    private String leasePeriod;
    private Integer leaseDuration;
    private BigDecimal estimatedCost;
    private String companyName;
    private String contactName;
    private String contactPhone;
    private String deliveryAddress;
    private String onsiteAddress;
    private LocalDate expectedStartDate;
    private String remark;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
