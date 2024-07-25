package com.bookverse.BookVerse.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "Abdelrahman Mosad",
                        email = "bodymosad67@gmail.com",
                        url = "https://github.com/bedo-morad"
                ),
                description = "OpenApi documentation for BookVerse",
                title = "OpenApi specification - BookVerse",
                version = "1.0",
                license = @License(
                        name = "Apache-2.0 license",
                        url = "https://www.apache.org/licenses/LICENSE-2.0"
                ),
                termsOfService = "Terms of service"
        ),
        servers = {
                @Server(
                        description = "local Env",
                        url = "http://localhost:8088/api/v1"
                ),
                @Server(
                        description = "Production Env",
                        url = "https://fake-api-url.com/api/v1"
                )
        },
        security = {
                @SecurityRequirement(
                        name = "bearerAuth"
                )
        }
)
@SecurityScheme(
        name = "bearerAuth",
        description = "JWT auth description",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
