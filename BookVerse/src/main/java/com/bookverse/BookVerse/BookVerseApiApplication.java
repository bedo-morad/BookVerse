package com.bookverse.BookVerse;

import com.bookverse.BookVerse.role.Role;
import com.bookverse.BookVerse.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableJpaAuditing()
@EnableAsync
@SpringBootApplication
public class BookVerseApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookVerseApiApplication.class, args);

    }

    @Bean
    public CommandLineRunner runner(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName("USER").isEmpty()) {
                roleRepository.save(Role.builder().name("USER").build());
            }
        };
    }
}
