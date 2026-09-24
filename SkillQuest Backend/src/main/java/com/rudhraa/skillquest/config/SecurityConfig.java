package com.rudhraa.skillquest.config;

import com.rudhraa.skillquest.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()
                        // Public endpoints
                        .requestMatchers(
                                "/api/users/register",
                                "/api/auth/login"
                        ).permitAll()

                        // User management - ADMIN only
                                // Current logged-in user profile
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/users/me"
                                ).authenticated()

// User management - ADMIN only
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/users",
                                        "/api/users/**"
                                ).hasRole("ADMIN")

                        // Course creation - ADMIN only
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/courses",
                                "/api/courses/**"
                        ).hasRole("ADMIN")

                        // Course update - ADMIN only
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/courses/**"
                        ).hasRole("ADMIN")

                        // Course deletion - ADMIN only
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/courses/**"
                        ).hasRole("ADMIN")

                        // Topic creation - ADMIN only
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/topics",
                                "/api/topics/**"
                        ).hasRole("ADMIN")

                        // Topic update - ADMIN only
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/topics/**"
                        ).hasRole("ADMIN")

                        // Topic deletion - ADMIN only
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/topics/**"
                        ).hasRole("ADMIN")

                        // Activity creation - ADMIN only
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/activities",
                                "/api/activities/**"
                        ).hasRole("ADMIN")

                        // Activity update - ADMIN only
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/activities/**"
                        ).hasRole("ADMIN")

                        // Activity deletion - ADMIN only
                                .requestMatchers(
                                        HttpMethod.DELETE,
                                        "/api/activities/**"
                                ).hasRole("ADMIN")

                                // Activity Question creation - ADMIN only
                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/activity-questions/activity/**"
                                ).hasRole("ADMIN")

                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/activity-questions/validate"
                                ).authenticated()

                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/activity-questions/**"
                                ).hasRole("ADMIN")

// Activity Question update - ADMIN only
                                .requestMatchers(
                                        HttpMethod.PUT,
                                        "/api/activity-questions/**"
                                ).hasRole("ADMIN")

// Activity Question deletion - ADMIN only
                                .requestMatchers(
                                        HttpMethod.DELETE,
                                        "/api/activity-questions/**"
                                ).hasRole("ADMIN")

                                .requestMatchers(
                                        "/api/progress/admin/**"
                                ).hasRole("ADMIN")
                        // All remaining APIs require login
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5500",
                        "http://127.0.0.1:5500"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/api/**",
                configuration
        );

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration)
            throws Exception {

        return authenticationConfiguration.getAuthenticationManager();
    }
}