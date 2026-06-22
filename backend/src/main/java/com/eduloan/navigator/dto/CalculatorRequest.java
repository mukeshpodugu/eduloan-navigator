package com.eduloan.navigator.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CalculatorRequest {

    @NotNull(message = "Principal amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Principal must be greater than 0")
    private BigDecimal principal;

    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Interest rate must be greater than 0")
    private BigDecimal interestRate;

    @NotNull(message = "Tenure is required")
    @Min(value = 1, message = "Tenure must be at least 1 month")
    private Integer tenureMonths;

    private Integer moratoriumMonths = 0;

    private String moratoriumInterestType = "COMPOUND"; // SIMPLE, COMPOUND, DEFERRED

    // Getters and Setters
    public BigDecimal getPrincipal() {
        return principal;
    }

    public void setPrincipal(BigDecimal principal) {
        this.principal = principal;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public Integer getMoratoriumMonths() {
        return moratoriumMonths;
    }

    public void setMoratoriumMonths(Integer moratoriumMonths) {
        this.moratoriumMonths = moratoriumMonths;
    }

    public String getMoratoriumInterestType() {
        return moratoriumInterestType;
    }

    public void setMoratoriumInterestType(String moratoriumInterestType) {
        this.moratoriumInterestType = moratoriumInterestType;
    }
}
