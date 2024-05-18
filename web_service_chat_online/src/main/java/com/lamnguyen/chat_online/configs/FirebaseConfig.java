package com.lamnguyen.chat_online.configs;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ResourceUtils;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp createFirebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) return FirebaseApp.getInstance();
        FileInputStream refreshToken = new FileInputStream(ResourceUtils.getFile("classpath:firebase-config.json"));
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(refreshToken))
                .setDatabaseUrl("https://program-chat-online-default-rtdb.firebaseio.com")
                .build();
        return FirebaseApp.initializeApp(options);
    }

    @Bean
    public DatabaseReference reference(FirebaseApp firebaseApp) {
        return FirebaseDatabase.getInstance(firebaseApp).getReference();
    }
}
