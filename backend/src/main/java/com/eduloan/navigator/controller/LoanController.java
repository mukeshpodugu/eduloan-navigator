package com.eduloan.navigator.controller;

import com.eduloan.navigator.dto.CalculatorResponse;
import com.eduloan.navigator.dto.PrepaymentRequest;
import com.eduloan.navigator.dto.PrepaymentResponse;
import com.eduloan.navigator.model.Loan;
import com.eduloan.navigator.model.Prepayment;
import com.eduloan.navigator.model.User;
import com.eduloan.navigator.repository.UserRepository;
import com.eduloan.navigator.security.UserPrincipal;
import com.eduloan.navigator.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public ResponseEntity<List<Loan>> getUserLoans(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = getAuthenticatedUser(userPrincipal);
        List<Loan> loans = loanService.getLoansByUser(user);
        return ResponseEntity.ok(loans);
    }

    @PostMapping
    public ResponseEntity<Loan> saveLoan(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, Object> payload) {

        User user = getAuthenticatedUser(userPrincipal);
        String bankName = (String) payload.get("bankName");
        BigDecimal principal = new BigDecimal(payload.get("principal").toString());
        BigDecimal interestRate = new BigDecimal(payload.get("interestRate").toString());
        Integer tenureMonths = Integer.parseInt(payload.get("tenureMonths").toString());
        Integer moratoriumMonths = payload.containsKey("moratoriumMonths") ? Integer.parseInt(payload.get("moratoriumMonths").toString()) : 0;
        String moratoriumInterestType = payload.containsKey("moratoriumInterestType") ? (String) payload.get("moratoriumInterestType") : "COMPOUND";

        Loan loan = loanService.saveLoan(user, bankName, principal, interestRate, tenureMonths, moratoriumMonths, moratoriumInterestType);
        return ResponseEntity.ok(loan);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> getLoanDetails(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        Loan loan = loanService.getLoanById(id);
        // Authorization check
        if (!loan.getUser().getId().equals(userPrincipal.getId()) && !userPrincipal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(loan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLoan(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        User user = getAuthenticatedUser(userPrincipal);
        loanService.deleteLoan(id, user);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Loan deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/amortization")
    public ResponseEntity<CalculatorResponse> getAmortization(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        Loan loan = loanService.getLoanById(id);
        if (!loan.getUser().getId().equals(userPrincipal.getId()) && !userPrincipal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        CalculatorResponse response = loanService.getLoanAmortization(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/prepayments")
    public ResponseEntity<List<Prepayment>> savePrepayments(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @RequestBody List<PrepaymentRequest.OneTimePrepayment> prepayments) {
        User user = getAuthenticatedUser(userPrincipal);
        List<Prepayment> saved = loanService.savePrepayments(id, prepayments, user);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}/prepayments")
    public ResponseEntity<List<Prepayment>> getPrepayments(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        Loan loan = loanService.getLoanById(id);
        if (!loan.getUser().getId().equals(userPrincipal.getId())) {
            return ResponseEntity.status(403).build();
        }
        List<Prepayment> list = loanService.getPrepayments(id);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}/optimize")
    public ResponseEntity<PrepaymentResponse> getOptimizedPrepayment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") BigDecimal extraPayment) {
        Loan loan = loanService.getLoanById(id);
        if (!loan.getUser().getId().equals(userPrincipal.getId())) {
            return ResponseEntity.status(403).build();
        }
        PrepaymentResponse response = loanService.getLoanOptimizedPrepayment(id, extraPayment);
        return ResponseEntity.ok(response);
    }
}
