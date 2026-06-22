package com.eduloan.navigator.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "system_configs")
public class SystemConfig {

    @Id
    @NotBlank
    @Size(max = 50)
    @Column(name = "config_key", length = 50)
    private String configKey;

    @NotBlank
    @Size(max = 255)
    @Column(name = "config_value", nullable = false)
    private String configValue;

    @Size(max = 255)
    private String description;

    public SystemConfig() {
    }

    public SystemConfig(String configKey, String configValue, String description) {
        this.configKey = configKey;
        this.configValue = configValue;
        this.description = description;
    }

    // Getters and Setters
    public String getConfigKey() {
        return configKey;
    }

    public void setConfigKey(String configKey) {
        this.configKey = configKey;
    }

    public String getConfigValue() {
        return configValue;
    }

    public void setConfigValue(String configValue) {
        this.configValue = configValue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
