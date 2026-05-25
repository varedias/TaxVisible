package com.minjue.modules.system.service;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.LineCaptcha;
import cn.hutool.core.util.IdUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 图形验证码服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CaptchaService {

    private final StringRedisTemplate stringRedisTemplate;

    private static final String CAPTCHA_KEY_PREFIX = "captcha:";
    private static final long CAPTCHA_EXPIRE_MINUTES = 5;

    /**
     * 生成图形验证码
     * 
     * @return 包含 uuid 和 imageBase64 的 Map
     */
    public Map<String, String> generateCaptcha() {
        // 生成验证码图片 (宽200, 高80, 4位字符, 干扰线数量)
        LineCaptcha captcha = CaptchaUtil.createLineCaptcha(200, 80, 4, 50);

        // 获取验证码文本
        String code = captcha.getCode();

        // 生成唯一标识
        String uuid = IdUtil.simpleUUID();

        // 存储到 Redis (忽略大小写，统一转小写)
        String redisKey = CAPTCHA_KEY_PREFIX + uuid;
        stringRedisTemplate.opsForValue().set(redisKey, code.toLowerCase(), CAPTCHA_EXPIRE_MINUTES, TimeUnit.MINUTES);

        log.debug("生成验证码: uuid={}, code={}", uuid, code);

        // 返回结果
        Map<String, String> result = new HashMap<>();
        result.put("uuid", uuid);
        result.put("imageBase64", captcha.getImageBase64Data());

        return result;
    }

    /**
     * 校验验证码
     * 
     * @param uuid 验证码唯一标识
     * @param code 用户输入的验证码
     * @return 是否正确
     */
    public boolean validateCaptcha(String uuid, String code) {
        if (uuid == null || code == null) {
            return false;
        }

        String redisKey = CAPTCHA_KEY_PREFIX + uuid;
        String storedCode = stringRedisTemplate.opsForValue().get(redisKey);

        if (storedCode == null) {
            log.debug("验证码已过期或不存在: uuid={}", uuid);
            return false;
        }

        // 验证后删除 (一次性使用)
        stringRedisTemplate.delete(redisKey);

        // 忽略大小写比较
        boolean valid = storedCode.equalsIgnoreCase(code);
        log.debug("验证码校验: uuid={}, input={}, stored={}, valid={}", uuid, code, storedCode, valid);

        return valid;
    }
}
