package com.eduloan.navigator.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "prepayments")
public class Prepayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = false)
    private Loan loan;

    @NotNull
    @DecimalMin("0.0")
    @Column(name = "prepayment_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal prepaymentAmount;

    @NotNull
    @Min(1)
    @Column(name = "prepayment_month", nullable = false)
    private Integer prepaymentMonth;

    @NotBlank
    @Column(nullable = false, length = 20)
    private String type = "ONE_TIME"; // ONE_TIME, RECURRING

    public Prepayment() {
    }

    public Prepayment(Loan loan, BigDecimal prepaymentAmount, Integer prepaymentMonth, String type) {
        this.loan = loan;
        this.prepaymentAmount = prepaymentAmount;
        this.prepaymentMonth = prepaymentMonth;
        this.type = type;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Loan getLoan() {
        return loan;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }

    public BigDecimal getPrepaymentAmount() {
        return prepaymentAmount;
    }

    public void setPrepaymentAmount(BigDecimal prepaymentAmount) {
        this.prepaymentAmount = prepaymentAmount;
    }

    public Integer getPrepaymentMonth() {
        return prepaymentMonth;
    }

    public void setPrepaymentMonth(Integer prepaymentMonth) {
        this.prepaymentMonth = prepaymentMonth;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
