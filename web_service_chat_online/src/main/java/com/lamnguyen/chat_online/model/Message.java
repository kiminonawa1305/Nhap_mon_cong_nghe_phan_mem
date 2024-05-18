package com.lamnguyen.chat_online.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @NotNull(message = "Message is not null!")
    @NotBlank(message = "Message is not null!")
    private String message;

    @NotNull(message = "User send is not null!")
    @NotBlank(message = "User send is not null!")
    private String userId;

    private Enum status;

    private String time;
}
