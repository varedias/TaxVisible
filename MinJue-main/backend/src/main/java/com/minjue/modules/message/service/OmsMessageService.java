package com.minjue.modules.message.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.minjue.modules.message.entity.OmsMessage;
import com.minjue.modules.message.mapper.OmsMessageMapper;
import org.springframework.stereotype.Service;

@Service
public class OmsMessageService extends ServiceImpl<OmsMessageMapper, OmsMessage> {
}
