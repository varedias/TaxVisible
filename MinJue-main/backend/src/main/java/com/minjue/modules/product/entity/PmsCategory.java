package com.minjue.modules.product.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;

/**
 * 商品分类实体
 */
@Data
@TableName("pms_category")
public class PmsCategory implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 分类名称 */
    private String name;

    /** 父分类ID, 0为顶级 */
    private Long parentId;

    /** 排序 */
    private Integer sort;

    /** 图标 */
    private String icon;
}
