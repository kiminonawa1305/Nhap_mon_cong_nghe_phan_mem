package com.lamnguyen.chat_online.exceptions;

import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalDefaultHandlerExceptionResolver {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleDefaultHandlerExceptionResolver(MethodArgumentNotValidException ex) {
        Map<String, String> map = new HashMap<>();
        ex.getAllErrors().forEach(error -> {
            String errorMessage = error.getDefaultMessage();
            String fieldName = ((FieldError) error).getField();
            map.put(fieldName, errorMessage);
        });
        return map;
    }


}
