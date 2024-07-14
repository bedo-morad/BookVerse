package com.bookverse.BookVerse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BookVerseApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookVerseApiApplication.class, args);
	}

}
