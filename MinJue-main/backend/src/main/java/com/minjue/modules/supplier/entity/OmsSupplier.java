package com.minjue.modules.supplier.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 供应商实体
 */
@Data
@TableName("oms_supplier")
public class OmsSupplier implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 供应商名称 */
    private String name;

    /** Logo URL */
    private String logo;

    /** 描述 */
    private String description;

    /** 联系方式 (JSON格式) */
    private String contactInfo;

    /** 是否认证: 0-未认证, 1-已认证 */
    private Integer isVerified;

    /** 创建时间 */
    private LocalDateTime createTime;

    /** 关联用户ID */
    private Long userId;
}
