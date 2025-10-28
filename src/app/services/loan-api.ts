import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * LOAN APPLICATION DATA MODEL
 * This defines what information we need from people applying for loans
 * Like a paper form that everyone fills out the same way
 */
export interface LoanApplication {
  fullName: string;        // Person's full name
  email: string;           // Email address to contact them
  monthlyIncome: number;   // How much money they make each month
  requestedAmount: number; // How much loan money they want
  existingDebts: number;   // Money they already owe to others
  loanTerm: number;        // How many months to pay back the loan
}

/**
 * LOAN DECISION RESULT
 * This is what we tell people after checking their application
 * Like a bank letter saying "YES you got the loan" or "NO sorry"
 */
export interface CreditDecision {
  riskScore: number;       // How risky this person is (0-100 scale)
  isApproved: boolean;     // YES or NO - did they get the loan?
  approvedAmount: number;  // How much money we're giving them
  interestRate: number;    // Extra percentage they'll pay back
  decisionReason: string;  // Explanation why we said YES or NO
  monthlyPayment?: number; // How much they pay each month (optional)
}

/**
 * LOAN API SERVICE - THE BANK MANAGER
 * This service makes all the loan decisions
 * It's like having a smart bank manager who never sleeps
 */
@Injectable({
  providedIn: 'root'  // Available everywhere in the app
})
export class LoanApiService {
  // Where we would send real applications (currently using mock data)
  private apiUrl = 'http://localhost:5000/api/loanapplications';

  constructor(private http: HttpClient) { }

  /**
   * SUBMIT LOAN APPLICATION
   * This is like handing your application form to the bank teller
   * People call this method when they click "Submit Application"
   */
  submitApplication(application: LoanApplication): Observable<CreditDecision> {
    // For now, we use mock data since we don't have a real bank server
    return this.mockSubmitApplication(application);
  }

  /**
   * MOCK LOAN DECISION MAKER
   * This makes real loan decisions using bank rules
   * It's temporary until we connect to a real bank server
   */
  private mockSubmitApplication(application: LoanApplication): Observable<CreditDecision> {
    
    // BANK RULE #1: Can't borrow more than 6 months of salary
    // This prevents people from taking loans they can't afford
    if (application.requestedAmount > application.monthlyIncome * 6) {
      return of({
        riskScore: 10,
        isApproved: false,
        approvedAmount: 0,
        interestRate: 0,
        decisionReason: 'Requested amount cannot exceed 6 times your monthly income'
      }).pipe(delay(1000)); // Wait 1 second to feel like real processing
    }

    // BANK RULE #2: Check if person has too much debt already
    // We calculate how much of their income goes to debt payments
    const totalMonthlyObligations = application.existingDebts + (application.requestedAmount * 0.03);
    const debtToIncome = totalMonthlyObligations / application.monthlyIncome;
    
    // If more than 60% of income goes to debt, that's too risky
    if (debtToIncome > 0.6) {
      return of({
        riskScore: 20,
        isApproved: false,
        approvedAmount: 0,
        interestRate: 0,
        decisionReason: 'Your debt-to-income ratio is too high for additional credit'
      }).pipe(delay(1000));
    }

    // BANK RULE #3: Set interest rate based on risk level
    // Safer borrowers get lower interest rates
    let interestRate = 8.5; // Normal rate for average risk people
    
    // Good risk = lower interest rate (they pay less extra)
    if (debtToIncome < 0.3) {
      interestRate = 6.5;
    } 
    // Higher risk = higher interest rate (they pay more extra)
    else if (debtToIncome > 0.5) {
      interestRate = 12.5;
    }

    // Calculate exactly how much they'll pay each month
    // This uses standard bank math that everyone uses
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = (application.requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, application.loanTerm)) / 
                          (Math.pow(1 + monthlyRate, application.loanTerm) - 1);

    // ALL CHECKS PASSED! LOAN APPROVED!
    return of({
      riskScore: 75,  // Good risk score
      isApproved: true, // YES, they get the loan!
      approvedAmount: application.requestedAmount, // Give them what they asked for
      interestRate: interestRate, // The interest rate we calculated
      decisionReason: 'Application approved', // Good news!
      monthlyPayment: Math.round(monthlyPayment * 100) / 100 // Rounded to cents
    }).pipe(delay(1000)); // Wait 1 second to feel real
  }
}