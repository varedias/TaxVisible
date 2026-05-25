package com.minjue.modules.leasing.dto;

import lombok.Data;

import java.time.LocalDate;

/**
 * 租赁设备收回参数
 */
@Data
public class LeasingTakeBackDTO {

    /** 收回日期 */
    private LocalDate returnDate;

    /** 收回地址 */
    private String returnAddress;

    /** 接收人 */
    private String receiverName;

    /** 设备状态 */
    private String equipmentCondition;

    /** 备注 */
    private String note;
}
