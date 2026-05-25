package com.minjue.modules.leasing.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.minjue.modules.leasing.entity.OmsLeasing;
import org.apache.ibatis.annotations.Mapper;

/**
 * 租赁设备Mapper
 */
@Mapper
public interface OmsLeasingMapper extends BaseMapper<OmsLeasing> {
}
