package com.minjue.common.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {
    private final Integer code;
    private final String message;

    public CustomException(String message) {
        this(500, message);
    }

    public CustomException(Integer code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}
