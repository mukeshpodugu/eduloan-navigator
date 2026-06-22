package com.eduloan.navigator.dto;

import java.math.BigDecimal;

public class AmortizationDetail {
    private int month;
    private BigDecimal beginningBalance;
    private BigDecimal payment;
    private BigDecimal principalPaid;
    private BigDecimal interestPaid;
    private BigDecimal endingBalance;
    private BigDecimal cumulativeInterest;
    private String phase; // "MORATORIUM" or "REPAYMENT"

    public AmortizationDetail() {
    }

    public AmortizationDetail(int month, BigDecimal beginningBalance, BigDecimal payment, BigDecimal principalPaid, BigDecimal interestPaid, BigDecimal endingBalance, BigDecimal cumulativeInterest, String phase) {
        this.month = month;
        this.beginningBalance = beginningBalance;
        this.payment = payment;
        this.principalPaid = principalPaid;
        this.interestPaid = interestPaid;
        this.endingBalance = endingBalance;
        this.cumulativeInterest = cumulativeInterest;
        this.phase = phase;
    }

    // Getters and Setters
    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public BigDecimal getBeginningBalance() {
        return beginningBalance;
    }

    public void setBeginningBalance(BigDecimal beginningBalance) {
        this.beginningBalance = beginningBalance;
    }

    public BigDecimal getPayment() {
        return payment;
    }

    public void setPayment(BigDecimal payment) {
        this.payment = payment;
    }

    public BigDecimal getPrincipalPaid() {
        return principalPaid;
    }

    public void setPrincipalPaid(BigDecimal principalPaid) {
        this.principalPaid = principalPaid;
    }

    public BigDecimal getInterestPaid() {
        return interestPaid;
    }

    public void setInterestPaid(BigDecimal interestPaid) {
        this.interestPaid = interestPaid;
    }

    public BigDecimal getEndingBalance() {
        return endingBalance;
    }

    public void setEndingBalance(BigDecimal endingBalance) {
        this.endingBalance = endingBalance;
    }

    public BigDecimal getCumulativeInterest() {
        return cumulativeInterest;
    }

    public void setCumulativeInterest(BigDecimal cumulativeInterest) {
        this.cumulativeInterest = cumulativeInterest;
    }

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }
}
