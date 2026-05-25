package com.minjue.modules.system.service;

import cn.hutool.core.util.RandomUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * 邮件验证码服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final StringRedisTemplate stringRedisTemplate;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final String EMAIL_CODE_PREFIX = "email:code:";
    private static final long EMAIL_CODE_EXPIRE_MINUTES = 5;

    /**
     * 发送验证码邮件
     *
     * @param toEmail 收件人邮箱
     * @param type    类型: register, reset, login
     * @return 发送是否成功
     */
    public boolean sendVerificationCode(String toEmail, String type) {
        // 生成6位数字验证码
        String code = RandomUtil.randomNumbers(6);

        // 存储到 Redis
        String redisKey = EMAIL_CODE_PREFIX + type + ":" + toEmail;
        stringRedisTemplate.opsForValue().set(redisKey, code, EMAIL_CODE_EXPIRE_MINUTES, TimeUnit.MINUTES);

        try {
            // 创建邮件
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("【民崛智能】验证码");

            // HTML 邮件内容
            String htmlContent = buildEmailHtml(code, type);
            helper.setText(htmlContent, true);

            // 发送邮件
            mailSender.send(message);
            log.info("验证码邮件发送成功: to={}, type={}, code={}", toEmail, type, code);
            return true;

        } catch (MessagingException e) {
            log.error("验证码邮件发送失败: to={}, error={}", toEmail, e.getMessage());
            return false;
        }
    }

    /**
     * 校验邮箱验证码
     */
    public boolean validateEmailCode(String email, String code, String type) {
        if (email == null || code == null) {
            return false;
        }

        String redisKey = EMAIL_CODE_PREFIX + type + ":" + email;
        String storedCode = stringRedisTemplate.opsForValue().get(redisKey);

        if (storedCode == null) {
            log.debug("邮箱验证码已过期或不存在: email={}", email);
            return false;
        }

        // 验证后删除 (一次性使用)
        stringRedisTemplate.delete(redisKey);

        boolean valid = storedCode.equals(code);
        log.debug("邮箱验证码校验: email={}, valid={}", email, valid);

        return valid;
    }

    /**
     * 构建 HTML 邮件内容
     */
    private String buildEmailHtml(String code, String type) {
        String actionText = switch (type) {
            case "register" -> "注册账号";
            case "reset" -> "重置密码";
            case "login" -> "登录验证";
            default -> "操作验证";
        };

        // 新主题色: 科技蓝
        String themeColor = "#0056b3";
        String gradientStart = "#1e3c72";
        String gradientEnd = "#2a5298";

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Microsoft YaHei', Arial, sans-serif; background-color: #f5f7fa;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <!-- 头部 Banner -->
                        <div style="background: linear-gradient(135deg, %s 0%%, %s 100%%); border-radius: 16px 16px 0 0; padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;">
                                🏭 民崛智能科技
                            </h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px;">
                                工业智能视觉检测专家
                            </p>
                        </div>

                        <!-- 主体内容 -->
                        <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                            <h2 style="color: #333; margin: 0 0 20px; font-size: 22px;">
                                您正在进行 <span style="color: %s;">%s</span>
                            </h2>

                            <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 30px;">
                                您的验证码为：
                            </p>

                            <!-- 验证码展示 -->
                            <div style="background: #f0f4f8; border-left: 5px solid %s; border-radius: 4px; padding: 25px; text-align: center; margin: 0 0 30px;">
                                <span style="font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #333; font-family: 'Courier New', monospace;">
                                    %s
                                </span>
                            </div>

                            <p style="color: #888; font-size: 13px; margin: 0 0 30px;">
                                ⏰ 验证码有效期为 <strong>5分钟</strong>，请尽快使用。<br>
                                🔒 如非本人操作，请忽略此邮件。
                            </p>

                            <!-- 分割线 -->
                            <div style="border-top: 1px dashed #eee; margin: 30px 0; padding-top: 30px;">
                                <h3 style="color: #333; margin: 0 0 15px; font-size: 16px;">
                                    🌟 为什么选择民崛智能？
                                </h3>
                                <ul style="color: #666; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
                                    <li>✅ 专业模具视觉监测系统</li>
                                    <li>✅ AI智能缺陷检测，精度高达99.5%%</li>
                                    <li>✅ 一站式工业设备采购平台</li>
                                </ul>
                            </div>

                            <!-- CTA 按钮 -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:3001"
                                   style="display: inline-block; background-color: %s;
                                          color: white; text-decoration: none; padding: 14px 40px; border-radius: 6px;
                                          font-size: 16px; font-weight: bold; transition: background 0.3s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                    立即访问平台 →
                                </a>
                            </div>
                        </div>

                        <!-- 底部信息 -->
                        <div style="text-align: center; padding: 25px; color: #999; font-size: 12px; line-height: 1.6;">
                            <p style="margin: 0 0 5px;">
                                © 2026 民崛智能科技有限公司 | 上海市
                            </p>
                            <p style="margin: 0 0 15px;">
                                联系我们:
                                <a href="mailto:2478686497@qq.com" style="color: %s; text-decoration: none;">2478686497@qq.com</a> /
                                <a href="mailto:ercurym86@gmail.com" style="color: %s; text-decoration: none;">ercurym86@gmail.com</a>
                            </p>
                            <div style="border-top: 1px solid #e1e1e1; width: 200px; margin: 10px auto;"></div>
                            <p style="margin: 10px 0 0;">
                                Development Team:<br>
                                主开发: <a href="https://github.com/IceYuanyyy" target="_blank" style="color: #666; text-decoration: underline;">IceYuanyyy</a> &nbsp;|&nbsp;
                                副开发: <a href="https://github.com/varedias" target="_blank" style="color: #666; text-decoration: underline;">varedias</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        gradientStart, gradientEnd,
                        themeColor, actionText,
                        themeColor, code,
                        themeColor,
                        themeColor, themeColor);
    }
}
