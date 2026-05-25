package com.minjue.modules.leasing.dto;

import lombok.Data;

/**
 * 供应商审核租赁申请参数
 */
@Data
public class LeasingApplicationReviewDTO {

    /** 审核状态: 1-通过 2-驳回 */
    private Integer status;
}
