package com.minjue.modules.interaction.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 商品评论实体
 */
@Data
@TableName("pms_comment")
public class PmsComment implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long productId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private Integer rating;
    private String content;
    private String images;
    private Integer helpful;
    private Integer status;
    private LocalDateTime createTime;
}
