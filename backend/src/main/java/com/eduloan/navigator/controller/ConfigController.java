package com.eduloan.navigator.controller;

import com.eduloan.navigator.model.SystemConfig;
import com.eduloan.navigator.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @Autowired
    private SystemConfigRepository configRepository;

    @GetMapping("/public")
    public ResponseEntity<Map<String, String>> getPublicConfigs() {
        List<SystemConfig> configs = configRepository.findAll();
        Map<String, String> publicConfigs = new HashMap<>();
        for (SystemConfig config : configs) {
            publicConfigs.put(config.getConfigKey(), config.getConfigValue());
        }
        return ResponseEntity.ok(publicConfigs);
    }
}
