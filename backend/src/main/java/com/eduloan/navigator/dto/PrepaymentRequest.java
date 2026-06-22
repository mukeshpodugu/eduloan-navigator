package com.eduloan.navigator.dto;

import java.math.BigDecimal;
import java.util.List;

public class PrepaymentRequest {

    private BigDecimal principal;
    private BigDecimal interestRate;
    private Integer tenureMonths;
    private Integer moratoriumMonths = 0;
    private String moratoriumInterestType = "COMPOUND";

    private BigDecimal extraPayment = BigDecimal.ZERO; // Extra payment to be added (e.g. monthly)
    private String extraPaymentFrequency = "MONTHLY"; // MONTHLY, YEARLY

    private List<OneTimePrepayment> oneTimePayments;

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

    public BigDecimal getExtraPayment() {
        return extraPayment;
    }

    public void setExtraPayment(BigDecimal extraPayment) {
        this.extraPayment = extraPayment;
    }

    public String getExtraPaymentFrequency() {
        return extraPaymentFrequency;
    }

    public void setExtraPaymentFrequency(String extraPaymentFrequency) {
        this.extraPaymentFrequency = extraPaymentFrequency;
    }

    public List<OneTimePrepayment> getOneTimePayments() {
        return oneTimePayments;
    }

    public void setOneTimePayments(List<OneTimePrepayment> oneTimePayments) {
        this.oneTimePayments = oneTimePayments;
    }

    public static class OneTimePrepayment {
        private Integer month;
        private BigDecimal amount;

        public OneTimePrepayment() {
        }

        public OneTimePrepayment(Integer month, BigDecimal amount) {
            this.month = month;
            this.amount = amount;
        }

        public Integer getMonth() {
            return month;
        }

        public void setMonth(Integer month) {
            this.month = month;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }
}
