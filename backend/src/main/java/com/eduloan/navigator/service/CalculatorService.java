package com.eduloan.navigator.service;

import com.eduloan.navigator.dto.AmortizationDetail;
import com.eduloan.navigator.dto.CalculatorRequest;
import com.eduloan.navigator.dto.CalculatorResponse;
import com.eduloan.navigator.dto.ComparisonRequest;
import com.eduloan.navigator.dto.ComparisonResponse;
import com.eduloan.navigator.dto.PrepaymentRequest;
import com.eduloan.navigator.dto.PrepaymentResponse;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CalculatorService {

    public CalculatorResponse calculateLoan(CalculatorRequest request) {
        BigDecimal principal = request.getPrincipal();
        BigDecimal annualRate = request.getInterestRate();
        int tenure = request.getTenureMonths();
        int moratorium = request.getMoratoriumMonths() == null ? 0 : request.getMoratoriumMonths();
        String type = request.getMoratoriumInterestType() == null ? "COMPOUND" : request.getMoratoriumInterestType().toUpperCase();

        BigDecimal r = annualRate.divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);
        BigDecimal accumulatedInterest = BigDecimal.ZERO;
        BigDecimal capitalizedPrincipal = principal;

        List<AmortizationDetail> schedule = new ArrayList<>();
        BigDecimal cumInterest = BigDecimal.ZERO;

        // 1. Moratorium Phase
        if (moratorium > 0) {
            BigDecimal currentBalance = principal;
            for (int month = 1; month <= moratorium; month++) {
                BigDecimal interestForMonth = currentBalance.multiply(r).setScale(2, RoundingMode.HALF_UP);
                BigDecimal payment = BigDecimal.ZERO;
                BigDecimal principalPaid = BigDecimal.ZERO;
                BigDecimal endingBalance = currentBalance;

                if ("COMPOUND".equals(type)) {
                    endingBalance = currentBalance.add(interestForMonth);
                    accumulatedInterest = accumulatedInterest.add(interestForMonth);
                    currentBalance = endingBalance;
                } else if ("SIMPLE".equals(type)) {
                    accumulatedInterest = accumulatedInterest.add(interestForMonth);
                    // Simple interest does not compound on the balance during moratorium
                } else if ("DEFERRED".equals(type)) {
                    // Deferred but paid monthly (interest-only payment)
                    payment = interestForMonth;
                    accumulatedInterest = accumulatedInterest.add(interestForMonth);
                }

                cumInterest = cumInterest.add(interestForMonth);
                schedule.add(new AmortizationDetail(
                        month,
                        currentBalance.setScale(2, RoundingMode.HALF_UP),
                        payment.setScale(2, RoundingMode.HALF_UP),
                        principalPaid.setScale(2, RoundingMode.HALF_UP),
                        interestForMonth,
                        endingBalance.setScale(2, RoundingMode.HALF_UP),
                        cumInterest.setScale(2, RoundingMode.HALF_UP),
                        "MORATORIUM"
                ));
            }

            if ("SIMPLE".equals(type)) {
                capitalizedPrincipal = principal.add(accumulatedInterest);
            } else if ("COMPOUND".equals(type)) {
                capitalizedPrincipal = principal.add(accumulatedInterest);
            } else {
                capitalizedPrincipal = principal; // DEFERRED (paid) doesn't increase principal
            }
        }

        // Calculate Monthly EMI for repayment phase
        BigDecimal emi = calculateEmi(capitalizedPrincipal, annualRate, tenure);

        // 2. Repayment Phase
        BigDecimal currentBalance = capitalizedPrincipal;
        BigDecimal totalRepaymentInterest = BigDecimal.ZERO;

        for (int i = 1; i <= tenure; i++) {
            int monthIndex = moratorium + i;
            if (currentBalance.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            BigDecimal interestForMonth = currentBalance.multiply(r).setScale(2, RoundingMode.HALF_UP);
            BigDecimal payment = emi;
            BigDecimal principalPaid = emi.subtract(interestForMonth);

            if (currentBalance.compareTo(principalPaid) < 0) {
                principalPaid = currentBalance;
                payment = principalPaid.add(interestForMonth);
            }

            BigDecimal endingBalance = currentBalance.subtract(principalPaid);
            totalRepaymentInterest = totalRepaymentInterest.add(interestForMonth);
            cumInterest = cumInterest.add(interestForMonth);

            schedule.add(new AmortizationDetail(
                    monthIndex,
                    currentBalance.setScale(2, RoundingMode.HALF_UP),
                    payment.setScale(2, RoundingMode.HALF_UP),
                    principalPaid.setScale(2, RoundingMode.HALF_UP),
                    interestForMonth,
                    endingBalance.setScale(2, RoundingMode.HALF_UP),
                    cumInterest.setScale(2, RoundingMode.HALF_UP),
                    "REPAYMENT"
            ));

            currentBalance = endingBalance;
        }

        BigDecimal totalInterest = accumulatedInterest.add(totalRepaymentInterest);
        BigDecimal totalPayment = principal.add(totalInterest);

        // For DEFERRED, the total interest paid during moratorium was paid monthly, but it is part of total interest
        return new CalculatorResponse(
                principal.setScale(2, RoundingMode.HALF_UP),
                moratorium,
                accumulatedInterest.setScale(2, RoundingMode.HALF_UP),
                capitalizedPrincipal.setScale(2, RoundingMode.HALF_UP),
                emi.setScale(2, RoundingMode.HALF_UP),
                totalInterest.setScale(2, RoundingMode.HALF_UP),
                totalPayment.setScale(2, RoundingMode.HALF_UP),
                schedule
        );
    }

    public BigDecimal calculateEmi(BigDecimal principal, BigDecimal annualRate, int tenureMonths) {
        if (principal.compareTo(BigDecimal.ZERO) <= 0 || tenureMonths <= 0) {
            return BigDecimal.ZERO;
        }
        if (annualRate.compareTo(BigDecimal.ZERO) <= 0) {
            return principal.divide(BigDecimal.valueOf(tenureMonths), 2, RoundingMode.HALF_UP);
        }

        BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);
        BigDecimal onePlusRN = monthlyRate.add(BigDecimal.ONE).pow(tenureMonths);

        BigDecimal numerator = principal.multiply(monthlyRate).multiply(onePlusRN);
        BigDecimal denominator = onePlusRN.subtract(BigDecimal.ONE);

        if (denominator.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return numerator.divide(denominator, 2, RoundingMode.HALF_UP);
    }

    public ComparisonResponse compareLoans(ComparisonRequest request) {
        List<ComparisonResponse.ComparisonResult> results = new ArrayList<>();
        if (request.getLoans() != null) {
            for (ComparisonRequest.ComparisonItem item : request.getLoans()) {
                CalculatorRequest calReq = new CalculatorRequest();
                calReq.setPrincipal(item.getPrincipal());
                calReq.setInterestRate(item.getInterestRate());
                calReq.setTenureMonths(item.getTenureMonths());
                calReq.setMoratoriumMonths(item.getMoratoriumMonths());
                calReq.setMoratoriumInterestType(item.getMoratoriumInterestType());

                CalculatorResponse calRes = calculateLoan(calReq);
                results.add(new ComparisonResponse.ComparisonResult(
                        item.getBankName(),
                        item.getPrincipal(),
                        item.getInterestRate(),
                        item.getTenureMonths(),
                        item.getMoratoriumMonths(),
                        item.getMoratoriumInterestType(),
                        calRes.getMonthlyEmi(),
                        calRes.getTotalInterest(),
                        calRes.getTotalPayment(),
                        calRes.getAccumulatedInterest(),
                        calRes.getCapitalizedPrincipal()
                ));
            }
        }
        return new ComparisonResponse(results);
    }

    public PrepaymentResponse optimizePrepayment(PrepaymentRequest request) {
        // 1. Calculate Standard Baseline
        CalculatorRequest standardReq = new CalculatorRequest();
        standardReq.setPrincipal(request.getPrincipal());
        standardReq.setInterestRate(request.getInterestRate());
        standardReq.setTenureMonths(request.getTenureMonths());
        standardReq.setMoratoriumMonths(request.getMoratoriumMonths());
        standardReq.setMoratoriumInterestType(request.getMoratoriumInterestType());

        CalculatorResponse baseline = calculateLoan(standardReq);

        BigDecimal principal = request.getPrincipal();
        BigDecimal annualRate = request.getInterestRate();
        int tenure = request.getTenureMonths();
        int moratorium = request.getMoratoriumMonths() == null ? 0 : request.getMoratoriumMonths();
        String type = request.getMoratoriumInterestType() == null ? "COMPOUND" : request.getMoratoriumInterestType().toUpperCase();

        BigDecimal r = annualRate.divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);
        BigDecimal accumulatedInterest = BigDecimal.ZERO;
        BigDecimal capitalizedPrincipal = principal;

        List<AmortizationDetail> schedule = new ArrayList<>();
        BigDecimal cumInterest = BigDecimal.ZERO;

        // Map custom one-time prepayments by month index
        Map<Integer, BigDecimal> oneTimeMap = new HashMap<>();
        if (request.getOneTimePayments() != null) {
            for (PrepaymentRequest.OneTimePrepayment otp : request.getOneTimePayments()) {
                if (otp.getMonth() != null && otp.getAmount() != null) {
                    oneTimeMap.put(otp.getMonth(), otp.getAmount());
                }
            }
        }

        // 1. Moratorium Phase (Standard calculation first)
        if (moratorium > 0) {
            BigDecimal currentBalance = principal;
            for (int month = 1; month <= moratorium; month++) {
                BigDecimal interestForMonth = currentBalance.multiply(r).setScale(2, RoundingMode.HALF_UP);
                BigDecimal payment = BigDecimal.ZERO;
                BigDecimal principalPaid = BigDecimal.ZERO;
                BigDecimal endingBalance = currentBalance;

                // Handle compound moratorium
                if ("COMPOUND".equals(type)) {
                    endingBalance = currentBalance.add(interestForMonth);
                    accumulatedInterest = accumulatedInterest.add(interestForMonth);
                    currentBalance = endingBalance;
                } else if ("SIMPLE".equals(type)) {
                    accumulatedInterest = accumulatedInterest.add(interestForMonth);
                } else if ("DEFERRED".equals(type)) {
                    payment = interestForMonth;
                    accumulatedInterest = accumulatedInterest.add(interestForMonth);
                }

                cumInterest = cumInterest.add(interestForMonth);
                schedule.add(new AmortizationDetail(
                        month,
                        currentBalance.setScale(2, RoundingMode.HALF_UP),
                        payment.setScale(2, RoundingMode.HALF_UP),
                        principalPaid.setScale(2, RoundingMode.HALF_UP),
                        interestForMonth,
                        endingBalance.setScale(2, RoundingMode.HALF_UP),
                        cumInterest.setScale(2, RoundingMode.HALF_UP),
                        "MORATORIUM"
                ));
            }

            if ("SIMPLE".equals(type) || "COMPOUND".equals(type)) {
                capitalizedPrincipal = principal.add(accumulatedInterest);
            } else {
                capitalizedPrincipal = principal;
            }
        }

        // Baseline EMI
        BigDecimal baseEmi = baseline.getMonthlyEmi();

        // 2. Repayment Phase with Prepayment Optimization
        BigDecimal currentBalance = capitalizedPrincipal;
        BigDecimal totalRepaymentInterest = BigDecimal.ZERO;
        int actualTenure = 0;

        for (int i = 1; i <= tenure * 2; i++) { // Allow schedule extension if needed, but normally prepayments reduce tenure
            int monthIndex = moratorium + i;
            if (currentBalance.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            actualTenure = i;
            BigDecimal interestForMonth = currentBalance.multiply(r).setScale(2, RoundingMode.HALF_UP);

            // Determine Extra Payment for this specific month
            BigDecimal extraPayment = BigDecimal.ZERO;
            if (request.getExtraPayment() != null && request.getExtraPayment().compareTo(BigDecimal.ZERO) > 0) {
                if ("MONTHLY".equalsIgnoreCase(request.getExtraPaymentFrequency())) {
                    extraPayment = request.getExtraPayment();
                } else if ("YEARLY".equalsIgnoreCase(request.getExtraPaymentFrequency()) && (i % 12 == 0)) {
                    extraPayment = request.getExtraPayment();
                }
            }

            // Add one-time prepayments
            BigDecimal otpAmount = oneTimeMap.getOrDefault(monthIndex, BigDecimal.ZERO);
            extraPayment = extraPayment.add(otpAmount);

            BigDecimal emiPayment = baseEmi;
            BigDecimal basePrincipalPaid = emiPayment.subtract(interestForMonth);
            BigDecimal totalPrincipalPaid = basePrincipalPaid.add(extraPayment);
            BigDecimal totalPayment = emiPayment.add(extraPayment);

            if (currentBalance.compareTo(totalPrincipalPaid) < 0) {
                totalPrincipalPaid = currentBalance;
                totalPayment = totalPrincipalPaid.add(interestForMonth);
            }

            BigDecimal endingBalance = currentBalance.subtract(totalPrincipalPaid);
            totalRepaymentInterest = totalRepaymentInterest.add(interestForMonth);
            cumInterest = cumInterest.add(interestForMonth);

            schedule.add(new AmortizationDetail(
                    monthIndex,
                    currentBalance.setScale(2, RoundingMode.HALF_UP),
                    totalPayment.setScale(2, RoundingMode.HALF_UP),
                    totalPrincipalPaid.setScale(2, RoundingMode.HALF_UP),
                    interestForMonth,
                    endingBalance.setScale(2, RoundingMode.HALF_UP),
                    cumInterest.setScale(2, RoundingMode.HALF_UP),
                    "REPAYMENT"
            ));

            currentBalance = endingBalance;
        }

        BigDecimal optimizedTotalInterest = accumulatedInterest.add(totalRepaymentInterest);
        BigDecimal optimizedTotalPayment = principal.add(optimizedTotalInterest);

        int monthsSaved = baseline.getAmortizationSchedule().size() - schedule.size();
        BigDecimal interestSaved = baseline.getTotalInterest().subtract(optimizedTotalInterest);
        BigDecimal totalSavings = baseline.getTotalPayment().subtract(optimizedTotalPayment);

        return new PrepaymentResponse(
                baseline.getAmortizationSchedule().size() - moratorium,
                baseline.getTotalInterest(),
                baseline.getTotalPayment(),
                actualTenure,
                optimizedTotalInterest.setScale(2, RoundingMode.HALF_UP),
                optimizedTotalPayment.setScale(2, RoundingMode.HALF_UP),
                Math.max(0, monthsSaved),
                interestSaved.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : interestSaved.setScale(2, RoundingMode.HALF_UP),
                totalSavings.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : totalSavings.setScale(2, RoundingMode.HALF_UP),
                schedule
        );
    }
}
