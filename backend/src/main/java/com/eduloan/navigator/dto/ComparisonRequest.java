package com.eduloan.navigator.dto;

import java.math.BigDecimal;
import java.util.List;

public class ComparisonRequest {

    private List<ComparisonItem> loans;

    public List<ComparisonItem> getLoans() {
        return loans;
    }

    public void setLoans(List<ComparisonItem> loans) {
        this.loans = loans;
    }

    public static class ComparisonItem {
        private String bankName;
        private BigDecimal principal;
        private BigDecimal interestRate;
        private Integer tenureMonths;
        private Integer moratoriumMonths = 0;
        private String moratoriumInterestType = "COMPOUND";

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
    }
}
