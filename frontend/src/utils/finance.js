// Financial Math Utilities (matches Java Backend logic exactly)

export const calculateEMI = (principal, annualRate, tenureMonths) => {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRate <= 0) return principal / tenureMonths;

  const monthlyRate = annualRate / (12 * 100);
  const onePlusRN = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * onePlusRN) / (onePlusRN - 1);
  return Number(emi.toFixed(2));
};

export const calculateLoanDetails = ({
  principal,
  interestRate,
  tenureMonths,
  moratoriumMonths = 0,
  moratoriumInterestType = 'COMPOUND'
}) => {
  const P = Number(principal);
  const R = Number(interestRate);
  const N = Number(tenureMonths);
  const M = Number(moratoriumMonths);
  const type = moratoriumInterestType.toUpperCase();

  const r = R / (12 * 100);
  let accumulatedInterest = 0;
  let capitalizedPrincipal = P;
  const schedule = [];
  let cumInterest = 0;

  // 1. Moratorium Phase
  if (M > 0) {
    let currentBalance = P;
    for (let month = 1; month <= M; month++) {
      const interestForMonth = Number((currentBalance * r).toFixed(2));
      let payment = 0;
      let principalPaid = 0;
      let endingBalance = currentBalance;

      if (type === 'COMPOUND') {
        endingBalance = currentBalance + interestForMonth;
        accumulatedInterest += interestForMonth;
        currentBalance = endingBalance;
      } else if (type === 'SIMPLE') {
        accumulatedInterest += interestForMonth;
      } else if (type === 'DEFERRED') {
        payment = interestForMonth;
        accumulatedInterest += interestForMonth;
      }

      cumInterest += interestForMonth;
      schedule.push({
        month,
        beginningBalance: Number(currentBalance.toFixed(2)),
        payment: Number(payment.toFixed(2)),
        principalPaid: Number(principalPaid.toFixed(2)),
        interestPaid: Number(interestForMonth.toFixed(2)),
        endingBalance: Number(endingBalance.toFixed(2)),
        cumulativeInterest: Number(cumInterest.toFixed(2)),
        phase: 'MORATORIUM'
      });
    }

    if (type === 'SIMPLE' || type === 'COMPOUND') {
      capitalizedPrincipal = P + accumulatedInterest;
    } else {
      capitalizedPrincipal = P; // DEFERRED (interest-only paid)
    }
  }

  // Monthly EMI for active repayment
  const emi = calculateEMI(capitalizedPrincipal, R, N);

  // 2. Repayment Phase
  let currentBalance = capitalizedPrincipal;
  let totalRepaymentInterest = 0;

  for (let i = 1; i <= N; i++) {
    const monthIndex = M + i;
    if (currentBalance <= 0) break;

    const interestForMonth = Number((currentBalance * r).toFixed(2));
    let payment = emi;
    let principalPaid = Number((emi - interestForMonth).toFixed(2));

    if (currentBalance < principalPaid) {
      principalPaid = currentBalance;
      payment = Number((principalPaid + interestForMonth).toFixed(2));
    }

    const endingBalance = Number((currentBalance - principalPaid).toFixed(2));
    totalRepaymentInterest += interestForMonth;
    cumInterest += interestForMonth;

    schedule.push({
      month: monthIndex,
      beginningBalance: Number(currentBalance.toFixed(2)),
      payment: Number(payment.toFixed(2)),
      principalPaid: Number(principalPaid.toFixed(2)),
      interestPaid: Number(interestForMonth.toFixed(2)),
      endingBalance: Number(endingBalance.toFixed(2)),
      cumulativeInterest: Number(cumInterest.toFixed(2)),
      phase: 'REPAYMENT'
    });

    currentBalance = endingBalance;
  }

  const totalInterest = accumulatedInterest + totalRepaymentInterest;
  const totalPayment = P + totalInterest;

  return {
    originalPrincipal: Number(P.toFixed(2)),
    moratoriumMonths: M,
    accumulatedInterest: Number(accumulatedInterest.toFixed(2)),
    capitalizedPrincipal: Number(capitalizedPrincipal.toFixed(2)),
    monthlyEmi: Number(emi.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalPayment: Number(totalPayment.toFixed(2)),
    amortizationSchedule: schedule
  };
};

export const optimizePrepayment = ({
  principal,
  interestRate,
  tenureMonths,
  moratoriumMonths = 0,
  moratoriumInterestType = 'COMPOUND',
  extraPayment = 0,
  extraPaymentFrequency = 'MONTHLY',
  oneTimePayments = []
}) => {
  const P = Number(principal);
  const R = Number(interestRate);
  const N = Number(tenureMonths);
  const M = Number(moratoriumMonths);
  const type = moratoriumInterestType.toUpperCase();
  const extraVal = Number(extraPayment);

  const baseline = calculateLoanDetails({
    principal: P,
    interestRate: R,
    tenureMonths: N,
    moratoriumMonths: M,
    moratoriumInterestType: type
  });

  const r = R / (12 * 100);
  let accumulatedInterest = 0;
  let capitalizedPrincipal = P;
  const schedule = [];
  let cumInterest = 0;

  // Map custom prepayments
  const oneTimeMap = {};
  oneTimePayments.forEach(otp => {
    if (otp.month && otp.amount) {
      oneTimeMap[otp.month] = Number(otp.amount);
    }
  });

  // 1. Moratorium Phase
  if (M > 0) {
    let currentBalance = P;
    for (let month = 1; month <= M; month++) {
      const interestForMonth = Number((currentBalance * r).toFixed(2));
      let payment = 0;
      let principalPaid = 0;
      let endingBalance = currentBalance;

      if (type === 'COMPOUND') {
        endingBalance = currentBalance + interestForMonth;
        accumulatedInterest += interestForMonth;
        currentBalance = endingBalance;
      } else if (type === 'SIMPLE') {
        accumulatedInterest += interestForMonth;
      } else if (type === 'DEFERRED') {
        payment = interestForMonth;
        accumulatedInterest += interestForMonth;
      }

      cumInterest += interestForMonth;
      schedule.push({
        month,
        beginningBalance: Number(currentBalance.toFixed(2)),
        payment: Number(payment.toFixed(2)),
        principalPaid: Number(principalPaid.toFixed(2)),
        interestPaid: Number(interestForMonth.toFixed(2)),
        endingBalance: Number(endingBalance.toFixed(2)),
        cumulativeInterest: Number(cumInterest.toFixed(2)),
        phase: 'MORATORIUM'
      });
    }

    if (type === 'SIMPLE' || type === 'COMPOUND') {
      capitalizedPrincipal = P + accumulatedInterest;
    } else {
      capitalizedPrincipal = P;
    }
  }

  // Baseline EMI
  const baseEmi = baseline.monthlyEmi;

  // 2. Repayment Phase with Prepayment Optimization
  let currentBalance = capitalizedPrincipal;
  let totalRepaymentInterest = 0;
  let actualTenure = 0;

  for (let i = 1; i <= N * 2; i++) {
    const monthIndex = M + i;
    if (currentBalance <= 0) break;

    actualTenure = i;
    const interestForMonth = Number((currentBalance * r).toFixed(2));

    // Determine Extra Payment
    let extra = 0;
    if (extraVal > 0) {
      if (extraPaymentFrequency === 'MONTHLY') {
        extra = extraVal;
      } else if (extraPaymentFrequency === 'YEARLY' && i % 12 === 0) {
        extra = extraVal;
      }
    }

    // Add one-time payment
    const otp = oneTimeMap[monthIndex] || 0;
    extra += otp;

    const basePrincipalPaid = Number((baseEmi - interestForMonth).toFixed(2));
    let totalPrincipalPaid = basePrincipalPaid + extra;
    let payment = Number((baseEmi + extra).toFixed(2));

    if (currentBalance < totalPrincipalPaid) {
      totalPrincipalPaid = currentBalance;
      payment = Number((totalPrincipalPaid + interestForMonth).toFixed(2));
    }

    const endingBalance = Number((currentBalance - totalPrincipalPaid).toFixed(2));
    totalRepaymentInterest += interestForMonth;
    cumInterest += interestForMonth;

    schedule.push({
      month: monthIndex,
      beginningBalance: Number(currentBalance.toFixed(2)),
      payment: Number(payment.toFixed(2)),
      principalPaid: Number(totalPrincipalPaid.toFixed(2)),
      interestPaid: Number(interestForMonth.toFixed(2)),
      endingBalance: Number(endingBalance.toFixed(2)),
      cumulativeInterest: Number(cumInterest.toFixed(2)),
      phase: 'REPAYMENT'
    });

    currentBalance = endingBalance;
  }

  const optimizedTotalInterest = accumulatedInterest + totalRepaymentInterest;
  const optimizedTotalPayment = P + optimizedTotalInterest;

  const monthsSaved = (baseline.amortizationSchedule.length - schedule.length);
  const interestSaved = baseline.totalInterest - optimizedTotalInterest;
  const totalSavings = baseline.totalPayment - optimizedTotalPayment;

  return {
    originalTenureMonths: baseline.amortizationSchedule.length - M,
    originalTotalInterest: Number(baseline.totalInterest.toFixed(2)),
    originalTotalPayment: Number(baseline.totalPayment.toFixed(2)),
    optimizedTenureMonths: actualTenure,
    optimizedTotalInterest: Number(optimizedTotalInterest.toFixed(2)),
    optimizedTotalPayment: Number(optimizedTotalPayment.toFixed(2)),
    monthsSaved: Math.max(0, monthsSaved),
    interestSaved: interestSaved < 0 ? 0 : Number(interestSaved.toFixed(2)),
    totalSavings: totalSavings < 0 ? 0 : Number(totalSavings.toFixed(2)),
    amortizationSchedule: schedule
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
