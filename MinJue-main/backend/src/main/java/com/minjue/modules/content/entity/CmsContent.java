package com.minjue.modules.content.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 内容/发现实体 (文章、视频等)
 */
@Data
@TableName("cms_content")
public class CmsContent implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 标题 */
    private String title;

    /** 英文标题 */
    private String titleEn;

    /** 内容类型: video, article, vlog */
    private String type;

    /** 封面图 */
    private String cover;

    /** 内容URL (视频链接或文章正文) */
    private String contentUrl;

    /** 作者 */
    private String author;

    /** 浏览量 */
    private Integer views;

    /** 分类: review, tutorial, vlog, news */
    private String category;

    /** 标签 (JSON数组) */
    private String tags;

    /** 状态: 1-发布, 0-草稿 */
    private Integer status;

    /** 创建时间 */
    private LocalDateTime createTime;
}
