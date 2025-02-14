package com.trustace.googleFormClone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class GoogleFormCloneApplication {
	public static void main(String[] args) {
		SpringApplication.run(GoogleFormCloneApplication.class, args);
	}
}

