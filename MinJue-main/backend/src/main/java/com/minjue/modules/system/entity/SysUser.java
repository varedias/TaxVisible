package com.minjue.modules.system.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("sys_user")
public class SysUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;

    @JsonIgnore
    private String password;

    private String nickname;
    private String email;
    private String phone;
    private String avatar;

    /**
     * Role: USER, SUPPLIER, ADMIN
     */
    private String role;

    /**
     * Status: 1-Enabled, 0-Disabled
     */
    private Integer status;

    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
