package com.eduloan.navigator.dto;

import java.math.BigDecimal;
import java.util.List;

public class CalculatorResponse {
    private BigDecimal originalPrincipal;
    private Integer moratoriumMonths;
    private BigDecimal accumulatedInterest;
    private BigDecimal capitalizedPrincipal;
    private BigDecimal monthlyEmi;
    private BigDecimal totalInterest;
    private BigDecimal totalPayment;
    private List<AmortizationDetail> amortizationSchedule;

    public CalculatorResponse() {
    }

    public CalculatorResponse(BigDecimal originalPrincipal, Integer moratoriumMonths, BigDecimal accumulatedInterest, BigDecimal capitalizedPrincipal, BigDecimal monthlyEmi, BigDecimal totalInterest, BigDecimal totalPayment, List<AmortizationDetail> amortizationSchedule) {
        this.originalPrincipal = originalPrincipal;
        this.moratoriumMonths = moratoriumMonths;
        this.accumulatedInterest = accumulatedInterest;
        this.capitalizedPrincipal = capitalizedPrincipal;
        this.monthlyEmi = monthlyEmi;
        this.totalInterest = totalInterest;
        this.totalPayment = totalPayment;
        this.amortizationSchedule = amortizationSchedule;
    }

    // Getters and Setters
    public BigDecimal getOriginalPrincipal() {
        return originalPrincipal;
    }

    public void setOriginalPrincipal(BigDecimal originalPrincipal) {
        this.originalPrincipal = originalPrincipal;
    }

    public Integer getMoratoriumMonths() {
        return moratoriumMonths;
    }

    public void setMoratoriumMonths(Integer moratoriumMonths) {
        this.moratoriumMonths = moratoriumMonths;
    }

    public BigDecimal getAccumulatedInterest() {
        return accumulatedInterest;
    }

    public void setAccumulatedInterest(BigDecimal accumulatedInterest) {
        this.accumulatedInterest = accumulatedInterest;
    }

    public BigDecimal getCapitalizedPrincipal() {
        return capitalizedPrincipal;
    }

    public void setCapitalizedPrincipal(BigDecimal capitalizedPrincipal) {
        this.capitalizedPrincipal = capitalizedPrincipal;
    }

    public BigDecimal getMonthlyEmi() {
        return monthlyEmi;
    }

    public void setMonthlyEmi(BigDecimal monthlyEmi) {
        this.monthlyEmi = monthlyEmi;
    }

    public BigDecimal getTotalInterest() {
        return totalInterest;
    }

    public void setTotalInterest(BigDecimal totalInterest) {
        this.totalInterest = totalInterest;
    }

    public BigDecimal getTotalPayment() {
        return totalPayment;
    }

    public void setTotalPayment(BigDecimal totalPayment) {
        this.totalPayment = totalPayment;
    }

    public List<AmortizationDetail> getAmortizationSchedule() {
        return amortizationSchedule;
    }

    public void setAmortizationSchedule(List<AmortizationDetail> amortizationSchedule) {
        this.amortizationSchedule = amortizationSchedule;
    }
}
