package com.eduloan.navigator.dto;

import java.math.BigDecimal;
import java.util.List;

public class PrepaymentResponse {
    private Integer originalTenureMonths;
    private BigDecimal originalTotalInterest;
    private BigDecimal originalTotalPayment;

    private Integer optimizedTenureMonths;
    private BigDecimal optimizedTotalInterest;
    private BigDecimal optimizedTotalPayment;

    private Integer monthsSaved;
    private BigDecimal interestSaved;
    private BigDecimal totalSavings;

    private List<AmortizationDetail> amortizationSchedule;

    public PrepaymentResponse() {
    }

    public PrepaymentResponse(Integer originalTenureMonths, BigDecimal originalTotalInterest, BigDecimal originalTotalPayment, Integer optimizedTenureMonths, BigDecimal optimizedTotalInterest, BigDecimal optimizedTotalPayment, Integer monthsSaved, BigDecimal interestSaved, BigDecimal totalSavings, List<AmortizationDetail> amortizationSchedule) {
        this.originalTenureMonths = originalTenureMonths;
        this.originalTotalInterest = originalTotalInterest;
        this.originalTotalPayment = originalTotalPayment;
        this.optimizedTenureMonths = optimizedTenureMonths;
        this.optimizedTotalInterest = optimizedTotalInterest;
        this.optimizedTotalPayment = optimizedTotalPayment;
        this.monthsSaved = monthsSaved;
        this.interestSaved = interestSaved;
        this.totalSavings = totalSavings;
        this.amortizationSchedule = amortizationSchedule;
    }

    // Getters and Setters
    public Integer getOriginalTenureMonths() {
        return originalTenureMonths;
    }

    public void setOriginalTenureMonths(Integer originalTenureMonths) {
        this.originalTenureMonths = originalTenureMonths;
    }

    public BigDecimal getOriginalTotalInterest() {
        return originalTotalInterest;
    }

    public void setOriginalTotalInterest(BigDecimal originalTotalInterest) {
        this.originalTotalInterest = originalTotalInterest;
    }

    public BigDecimal getOriginalTotalPayment() {
        return originalTotalPayment;
    }

    public void setOriginalTotalPayment(BigDecimal originalTotalPayment) {
        this.originalTotalPayment = originalTotalPayment;
    }

    public Integer getOptimizedTenureMonths() {
        return optimizedTenureMonths;
    }

    public void setOptimizedTenureMonths(Integer optimizedTenureMonths) {
        this.optimizedTenureMonths = optimizedTenureMonths;
    }

    public BigDecimal getOptimizedTotalInterest() {
        return optimizedTotalInterest;
    }

    public void setOptimizedTotalInterest(BigDecimal optimizedTotalInterest) {
        this.optimizedTotalInterest = optimizedTotalInterest;
    }

    public BigDecimal getOptimizedTotalPayment() {
        return optimizedTotalPayment;
    }

    public void setOptimizedTotalPayment(BigDecimal optimizedTotalPayment) {
        this.optimizedTotalPayment = optimizedTotalPayment;
    }

    public Integer getMonthsSaved() {
        return monthsSaved;
    }

    public void setMonthsSaved(Integer monthsSaved) {
        this.monthsSaved = monthsSaved;
    }

    public BigDecimal getInterestSaved() {
        return interestSaved;
    }

    public void setInterestSaved(BigDecimal interestSaved) {
        this.interestSaved = interestSaved;
    }

    public BigDecimal getTotalSavings() {
        return totalSavings;
    }

    public void setTotalSavings(BigDecimal totalSavings) {
        this.totalSavings = totalSavings;
    }

    public List<AmortizationDetail> getAmortizationSchedule() {
        return amortizationSchedule;
    }

    public void setAmortizationSchedule(List<AmortizationDetail> amortizationSchedule) {
        this.amortizationSchedule = amortizationSchedule;
    }
}
