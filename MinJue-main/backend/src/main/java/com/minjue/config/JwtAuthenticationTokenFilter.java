package com.minjue.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.minjue.common.utils.JwtUtil;
import com.minjue.modules.system.entity.SysUser;
import com.minjue.modules.system.mapper.SysUserMapper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final SysUserMapper sysUserMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = request.getHeader("Authorization");

        if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            token = token.substring(7);
            try {
                Claims claims = jwtUtil.getClaimsByToken(token);
                String username = claims.getSubject();

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // 从数据库加载用户角色
                    SysUser user = sysUserMapper.selectOne(
                            new LambdaQueryWrapper<SysUser>().eq(SysUser::getUsername, username));
                    
                    List<SimpleGrantedAuthority> authorities = Collections.emptyList();
                    if (user != null && user.getRole() != null) {
                        // Spring Security 的 hasRole() 会自动添加 ROLE_ 前缀
                        authorities = Collections.singletonList(
                                new SimpleGrantedAuthority("ROLE_" + user.getRole()));
                    }
                    
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            username, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                // Token invalid or expired, ignore and let Security intercept
            }
        }

        filterChain.doFilter(request, response);
    }
}
