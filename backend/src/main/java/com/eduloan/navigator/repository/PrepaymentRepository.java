package com.eduloan.navigator.repository;

import com.eduloan.navigator.model.Prepayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrepaymentRepository extends JpaRepository<Prepayment, Long> {
    List<Prepayment> findByLoanIdOrderByPrepaymentMonthAsc(Long loanId);
    void deleteByLoanId(Long loanId);
}
