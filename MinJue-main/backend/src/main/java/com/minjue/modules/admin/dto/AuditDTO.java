package com.minjue.modules.admin.dto;

import lombok.Data;

@Data
public class AuditDTO {
    /** 供应商ID */
    private Long id;

    /** 是否通过: true-通过, false-拒绝 */
    private Boolean pass;

    /** 拒绝原因 (仅拒绝时必填) */
    private String reason;
}
