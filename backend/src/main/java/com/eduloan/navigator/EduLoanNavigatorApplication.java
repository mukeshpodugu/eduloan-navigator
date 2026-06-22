package com.eduloan.navigator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.net.URI;

@SpringBootApplication
public class EduLoanNavigatorApplication {
    public static void main(String[] args) {
        configureDatabaseProperties();
        SpringApplication.run(EduLoanNavigatorApplication.class, args);
    }

    private static void configureDatabaseProperties() {
        String databaseUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (databaseUrl == null || databaseUrl.isEmpty()) {
            databaseUrl = System.getenv("DATABASE_URL");
        }

        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            if (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://") || 
                databaseUrl.startsWith("jdbc:postgresql://")) {
                
                try {
                    String cleanUrl = databaseUrl;
                    if (cleanUrl.startsWith("jdbc:")) {
                        cleanUrl = cleanUrl.substring(5);
                    }
                    if (cleanUrl.startsWith("postgres://")) {
                        cleanUrl = "postgresql://" + cleanUrl.substring(11);
                    }
                    
                    URI dbUri = new URI(cleanUrl);
                    String userInfo = dbUri.getUserInfo();
                    if (userInfo != null && userInfo.contains(":")) {
                        String username = userInfo.split(":")[0];
                        String password = userInfo.split(":")[1];
                        String jdbcUrl = "jdbc:postgresql://" + dbUri.getHost() + 
                                         (dbUri.getPort() != -1 ? ":" + dbUri.getPort() : "") + 
                                         dbUri.getPath();
                        
                        System.setProperty("spring.datasource.url", jdbcUrl);
                        System.setProperty("spring.datasource.username", username);
                        System.setProperty("spring.datasource.password", password);
                        System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
                        System.setProperty("spring.jpa.database-platform", "org.hibernate.dialect.PostgreSQLDialect");
                        
                        System.out.println("Configured PostgreSQL DataSource from environment URL");
                    }
                } catch (Exception e) {
                    System.err.println("Error parsing database URL: " + e.getMessage());
                }
            }
        }
    }
}
