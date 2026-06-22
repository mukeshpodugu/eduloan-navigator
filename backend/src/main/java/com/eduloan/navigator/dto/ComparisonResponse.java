package com.eduloan.navigator.dto;

import java.math.BigDecimal;
import java.util.List;

public class ComparisonResponse {

    private List<ComparisonResult> results;

    public ComparisonResponse() {
    }

    public ComparisonResponse(List<ComparisonResult> results) {
        this.results = results;
    }

    public List<ComparisonResult> getResults() {
        return results;
    }

    public void setResults(List<ComparisonResult> results) {
        this.results = results;
    }

    public static class ComparisonResult {
        private String bankName;
        private BigDecimal principal;
        private BigDecimal interestRate;
        private Integer tenureMonths;
        private Integer moratoriumMonths;
        private String moratoriumInterestType;
        private BigDecimal monthlyEmi;
        private BigDecimal totalInterest;
        private BigDecimal totalPayment;
        private BigDecimal accumulatedInterest;
        private BigDecimal capitalizedPrincipal;

        public ComparisonResult() {
        }

        public ComparisonResult(String bankName, BigDecimal principal, BigDecimal interestRate, Integer tenureMonths, Integer moratoriumMonths, String moratoriumInterestType, BigDecimal monthlyEmi, BigDecimal totalInterest, BigDecimal totalPayment, BigDecimal accumulatedInterest, BigDecimal capitalizedPrincipal) {
            this.bankName = bankName;
            this.principal = principal;
            this.interestRate = interestRate;
            this.tenureMonths = tenureMonths;
            this.moratoriumMonths = moratoriumMonths;
            this.moratoriumInterestType = moratoriumInterestType;
            this.monthlyEmi = monthlyEmi;
            this.totalInterest = totalInterest;
            this.totalPayment = totalPayment;
            this.accumulatedInterest = accumulatedInterest;
            this.capitalizedPrincipal = capitalizedPrincipal;
        }

        // Getters and Setters
        public String getBankName() {
            return bankName;
        }

        public void setBankName(String bankName) {
            this.bankName = bankName;
        }

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
    }
}
