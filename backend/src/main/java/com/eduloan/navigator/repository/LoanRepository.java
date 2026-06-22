package com.eduloan.navigator.repository;

import com.eduloan.navigator.model.Loan;
import com.eduloan.navigator.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserOrderByCreatedAtDesc(User user);
    List<Loan> findByUserId(Long userId);
}
