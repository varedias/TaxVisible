package com.minjue.modules.system.controller;

import com.minjue.common.result.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import org.springframework.http.client.SimpleClientHttpRequestFactory;

/**
 * AI 代理接口 — 前端通过此接口调用智谱 API，避免暴露 API Key
 */
@Tag(name = "AI Proxy API")
@Slf4j
@RestController
@RequestMapping("/api/v1/ai")
public class AiProxyController {

    @Value("${ai.zhipu.api-key}")
    private String apiKey;

    @Value("${ai.zhipu.base-url}")
    private String baseUrl;

    @Value("${ai.zhipu.model}")
    private String model;

    private final RestTemplate restTemplate;

    public AiProxyController() {
        // 设置超时时间：连接超时10秒，读取超时60秒
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(60000);
        this.restTemplate = new RestTemplate(factory);
    }

    @Operation(summary = "AI 对话代理")
    @PostMapping("/chat")
    public Result<?> chat(@RequestBody ChatRequest request) {
        try {
            // 构建智谱 API 请求
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                    "model", model,
                    "messages", request.getMessages(),
                    "temperature", request.getTemperature() != null ? request.getTemperature() : 0.7,
                    "max_tokens", request.getMaxTokens() != null ? request.getMaxTokens() : 1000
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    baseUrl + "/chat/completions",
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // 提取 AI 的回复内容
                Map responseBody = response.getBody();
                List<Map> choices = (List<Map>) responseBody.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map message = (Map) choices.get(0).get("message");
                    String content = (String) message.get("content");
                    return Result.success(Map.of("content", content));
                }
            }
            return Result.error(500, "AI 服务响应异常");
        } catch (Exception e) {
            log.error("AI 代理请求失败:", e);
            return Result.error(500, "AI 服务暂时不可用，请稍后重试");
        }
    }

    /**
     * 对话请求体
     */
    @lombok.Data
    public static class ChatRequest {
        /** 消息列表，包含 role 和 content */
        private List<Map<String, String>> messages;
        /** 温度参数 0-1 */
        private Double temperature;
        /** 最大 token 数 */
        private Integer maxTokens;
    }
}
