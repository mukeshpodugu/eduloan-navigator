package com.eduloan.navigator.controller;

import com.eduloan.navigator.dto.CalculatorRequest;
import com.eduloan.navigator.dto.CalculatorResponse;
import com.eduloan.navigator.dto.ComparisonRequest;
import com.eduloan.navigator.dto.ComparisonResponse;
import com.eduloan.navigator.dto.PrepaymentRequest;
import com.eduloan.navigator.dto.PrepaymentResponse;
import com.eduloan.navigator.service.CalculatorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calculator")
public class CalculatorController {

    @Autowired
    private CalculatorService calculatorService;

    @PostMapping("/calculate")
    public ResponseEntity<CalculatorResponse> calculate(@Valid @RequestBody CalculatorRequest request) {
        CalculatorResponse response = calculatorService.calculateLoan(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/compare")
    public ResponseEntity<ComparisonResponse> compare(@RequestBody ComparisonRequest request) {
        ComparisonResponse response = calculatorService.compareLoans(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/optimize")
    public ResponseEntity<PrepaymentResponse> optimize(@RequestBody PrepaymentRequest request) {
        PrepaymentResponse response = calculatorService.optimizePrepayment(request);
        return ResponseEntity.ok(response);
    }
}
