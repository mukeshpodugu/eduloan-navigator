package com.eduloan.navigator.service;

import com.eduloan.navigator.dto.CalculatorRequest;
import com.eduloan.navigator.dto.CalculatorResponse;
import com.eduloan.navigator.dto.PrepaymentRequest;
import com.eduloan.navigator.dto.PrepaymentResponse;
import com.eduloan.navigator.model.Loan;
import com.eduloan.navigator.model.Prepayment;
import com.eduloan.navigator.model.User;
import com.eduloan.navigator.repository.LoanRepository;
import com.eduloan.navigator.repository.PrepaymentRepository;
import com.eduloan.navigator.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private PrepaymentRepository prepaymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CalculatorService calculatorService;

    public List<Loan> getLoansByUser(User user) {
        return loanRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @Transactional
    public Loan saveLoan(User user, String bankName, BigDecimal principal, BigDecimal interestRate, Integer tenureMonths, Integer moratoriumMonths, String moratoriumInterestType) {
        CalculatorRequest calcReq = new CalculatorRequest();
        calcReq.setPrincipal(principal);
        calcReq.setInterestRate(interestRate);
        calcReq.setTenureMonths(tenureMonths);
        calcReq.setMoratoriumMonths(moratoriumMonths);
        calcReq.setMoratoriumInterestType(moratoriumInterestType);

        CalculatorResponse calcRes = calculatorService.calculateLoan(calcReq);

        Loan loan = new Loan(
                user,
                bankName,
                principal,
                interestRate,
                tenureMonths,
                moratoriumMonths,
                moratoriumInterestType,
                calcRes.getMonthlyEmi()
        );

        return loanRepository.save(loan);
    }

    public Loan getLoanById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with id: " + id));
    }

    @Transactional
    public void deleteLoan(Long loanId, User user) {
        Loan loan = getLoanById(loanId);
        if (!loan.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ROLE_ADMIN")) {
            throw new RuntimeException("Unauthorized to delete this loan");
        }
        loanRepository.delete(loan);
    }

    @Transactional
    public List<Prepayment> savePrepayments(Long loanId, List<PrepaymentRequest.OneTimePrepayment> prepayments, User user) {
        Loan loan = getLoanById(loanId);
        if (!loan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to modify prepayments for this loan");
        }

        // Remove old prepayments
        prepaymentRepository.deleteByLoanId(loanId);

        // Add new prepayments
        List<Prepayment> prepaymentEntities = prepayments.stream()
                .map(p -> new Prepayment(loan, p.getAmount(), p.getMonth(), "ONE_TIME"))
                .collect(Collectors.toList());

        return prepaymentRepository.saveAll(prepaymentEntities);
    }

    public List<Prepayment> getPrepayments(Long loanId) {
        return prepaymentRepository.findByLoanIdOrderByPrepaymentMonthAsc(loanId);
    }

    public CalculatorResponse getLoanAmortization(Long loanId) {
        Loan loan = getLoanById(loanId);
        CalculatorRequest request = new CalculatorRequest();
        request.setPrincipal(loan.getPrincipal());
        request.setInterestRate(loan.getInterestRate());
        request.setTenureMonths(loan.getTenureMonths());
        request.setMoratoriumMonths(loan.getMoratoriumMonths());
        request.setMoratoriumInterestType(loan.getMoratoriumInterestType());

        return calculatorService.calculateLoan(request);
    }

    public PrepaymentResponse getLoanOptimizedPrepayment(Long loanId, BigDecimal extraMonthlyPayment) {
        Loan loan = getLoanById(loanId);
        List<Prepayment> savedOtp = prepaymentRepository.findByLoanIdOrderByPrepaymentMonthAsc(loanId);

        PrepaymentRequest request = new PrepaymentRequest();
        request.setPrincipal(loan.getPrincipal());
        request.setInterestRate(loan.getInterestRate());
        request.setTenureMonths(loan.getTenureMonths());
        request.setMoratoriumMonths(loan.getMoratoriumMonths());
        request.setMoratoriumInterestType(loan.getMoratoriumInterestType());

        request.setExtraPayment(extraMonthlyPayment);
        request.setExtraPaymentFrequency("MONTHLY");

        List<PrepaymentRequest.OneTimePrepayment> oneTimePayments = savedOtp.stream()
                .map(p -> new PrepaymentRequest.OneTimePrepayment(p.getPrepaymentMonth(), p.getPrepaymentAmount()))
                .collect(Collectors.toList());
        request.setOneTimePayments(oneTimePayments);

        return calculatorService.optimizePrepayment(request);
    }
}
