package com.rudhraa.skillquest.security;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import com.rudhraa.skillquest.service.CustomUserDetailsService;
import com.rudhraa.skillquest.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.rudhraa.skillquest.entity.User;
import com.rudhraa.skillquest.repository.UserRepository;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService customUserDetailsService, UserRepository userRepository) {

        this.jwtService = jwtService;
        this.customUserDetailsService = customUserDetailsService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken =
                authorizationHeader.substring(7);

        String username = jwtService.extractUsername(jwtToken);

        if (username != null
                && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails =
                    customUserDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(
                    jwtToken,
                    userDetails.getUsername())) {

                User user = userRepository
                        .findByUsername(username)
                        .orElse(null);

                if (user != null && user.isRestricted()) {

                    response.setStatus(
                            HttpServletResponse.SC_FORBIDDEN
                    );

                    response.setContentType(
                            "application/json"
                    );

                    response.getWriter().write(
                            "{\"message\":\"Your account has been restricted\"}"
                    );

                    return;
                }

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authenticationToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}