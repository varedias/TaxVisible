package com.minjue.modules.message.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 即时消息实体
 */
@Data
@TableName("oms_message")
public class OmsMessage implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 发送者用户ID */
    private Long senderId;

    /** 接收者用户ID */
    private Long receiverId;

    /** 供应商ID */
    private Long supplierId;

    /** 消息内容 */
    private String content;

    /** 消息类型: TEXT/IMAGE/FILE */
    private String messageType;

    /** 是否来自供应商 */
    private Boolean isFromSupplier;

    /** 是否已读 */
    private Boolean isRead;

    /** 创建时间 */
    private LocalDateTime createTime;
}
