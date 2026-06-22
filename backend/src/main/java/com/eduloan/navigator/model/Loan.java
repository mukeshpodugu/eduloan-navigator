package com.eduloan.navigator.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(name = "bank_name", nullable = false, length = 100)
    private String bankName;

    @NotNull
    @DecimalMin("0.0")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal principal;

    @NotNull
    @DecimalMin("0.0")
    @Column(name = "interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @NotNull
    @Min(1)
    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @NotNull
    @Min(0)
    @Column(name = "moratorium_months", nullable = false)
    private Integer moratoriumMonths = 0;

    @NotBlank
    @Column(name = "moratorium_interest_type", nullable = false, length = 30)
    private String moratoriumInterestType = "COMPOUND"; // SIMPLE, COMPOUND, DEFERRED

    @NotNull
    @Column(name = "monthly_emi", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyEmi;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Loan() {
    }

    public Loan(User user, String bankName, BigDecimal principal, BigDecimal interestRate, Integer tenureMonths, Integer moratoriumMonths, String moratoriumInterestType, BigDecimal monthlyEmi) {
        this.user = user;
        this.bankName = bankName;
        this.principal = principal;
        this.interestRate = interestRate;
        this.tenureMonths = tenureMonths;
        this.moratoriumMonths = moratoriumMonths;
        this.moratoriumInterestType = moratoriumInterestType;
        this.monthlyEmi = monthlyEmi;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
