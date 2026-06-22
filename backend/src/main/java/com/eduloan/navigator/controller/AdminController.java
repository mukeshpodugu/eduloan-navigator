package com.eduloan.navigator.controller;

import com.eduloan.navigator.dto.ContactQueryDto;
import com.eduloan.navigator.model.SystemConfig;
import com.eduloan.navigator.repository.ContactQueryRepository;
import com.eduloan.navigator.repository.LoanRepository;
import com.eduloan.navigator.repository.SystemConfigRepository;
import com.eduloan.navigator.repository.UserRepository;
import com.eduloan.navigator.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private ContactQueryRepository queryRepository;

    @Autowired
    private SystemConfigRepository configRepository;

    @Autowired
    private ContactService contactService;

    @GetMapping("/metrics")
    public ResponseEntity<?> getMetrics() {
        long totalUsers = userRepository.count();
        long totalLoans = loanRepository.count();
        long totalQueries = queryRepository.count();
        long pendingQueries = queryRepository.findAll().stream().filter(q -> "PENDING".equals(q.getStatus())).count();

        BigDecimal totalOutstandingPrincipal = loanRepository.findAll().stream()
                .map(l -> l.getPrincipal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalUsers", totalUsers);
        metrics.put("totalLoans", totalLoans);
        metrics.put("totalQueries", totalQueries);
        metrics.put("pendingQueries", pendingQueries);
        metrics.put("totalOutstandingPrincipal", totalOutstandingPrincipal);

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/queries")
    public ResponseEntity<List<ContactQueryDto>> getQueries() {
        return ResponseEntity.ok(contactService.getAllQueries());
    }

    @GetMapping("/configs")
    public ResponseEntity<List<SystemConfig>> getConfigs() {
        return ResponseEntity.ok(configRepository.findAll());
    }

    @PutMapping("/configs/{key}")
    public ResponseEntity<?> updateConfig(
            @PathVariable String key,
            @RequestBody Map<String, String> payload) {
        String value = payload.get("value");
        if (value == null) {
            return ResponseEntity.badRequest().body("Config value is required");
        }

        SystemConfig config = configRepository.findById(key)
                .orElse(new SystemConfig(key, value, "Custom dynamic config"));
        config.setConfigValue(value);
        configRepository.save(config);

        return ResponseEntity.ok(config);
    }
}
