package com.lamnguyen.chat_online.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/greeting")
    public String greeting() {
        return "Chào mừng bạn đến với phần mềm chat trực tuyến!";
    }
}
