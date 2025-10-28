import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoanApiService, LoanApplication, CreditDecision } from '../../services/loan-api';

/**
 * LOAN APPLICATION COMPONENT - THE BANK'S FRONT DESK
 * This is where users interact with your loan system
 * Contains the form, buttons, and displays loan decisions
 */
@Component({
  selector: 'app-loan-application',  // HTML tag: <app-loan-application>
  standalone: true,                  // Modern Angular - no NgModule needed
  imports: [FormsModule, CommonModule], // Required Angular features
  templateUrl: './loan-application.html', // The form template
  styleUrls: ['./loan-application.css']   // The styling
})
export class LoanApplicationComponent {
  /**
   * BLANK LOAN APPLICATION FORM
   * Like an empty paper form waiting to be filled out
   * This object stores all the user's information
   */
  application: LoanApplication = {
    fullName: '',       // Will store customer's name
    email: '',          // Will store email address
    monthlyIncome: 0,   // Will store how much they earn
    requestedAmount: 0, // Will store loan amount wanted
    existingDebts: 0,   // Will store current debts
    loanTerm: 0         // Will store repayment period (months)
  };

  decision: CreditDecision | null = null;  // Stores the bank's YES/NO decision
  isLoading: boolean = false;              // Shows "Processing..." when true
  submitted: boolean = false;              // Tracks if form was submitted

  // Inject the loan service - our "bank manager"
  constructor(private loanApiService: LoanApiService) {}

  /**
   * HANDLE FORM SUBMISSION
   * Called when user clicks "Submit Application"
   * Like handing a completed form to the bank teller
   */
  onSubmit() {
    this.submitted = true;  // Mark form as submitted
    
    // Only send to bank if all information is valid
    if (this.isFormValid()) {
      this.isLoading = true;    // Show loading spinner
      this.decision = null;     // Clear any previous decision
      
      // Send application to the bank service for decision
      this.loanApiService.submitApplication(this.application).subscribe({
        next: (result: CreditDecision) => {
          this.decision = result;      // Store the bank's decision
          this.isLoading = false;      // Hide loading spinner
        },
        error: (error: any) => {
          console.error('Application submission error:', error);
          this.isLoading = false;      // Hide loading spinner
          alert('System temporarily unavailable. Please try again.');
        }
      });
    }
  }

  /**
   * VALIDATE FORM DATA
   * Checks if all required fields are filled correctly
   * Like a bank teller checking your form for mistakes
   */
  isFormValid(): boolean {
    return (
      this.application.fullName.trim().length > 0 &&  // Name not empty
      this.application.email.includes('@') &&         // Valid email format
      this.application.monthlyIncome > 0 &&           // Positive income
      this.application.requestedAmount > 0 &&         // Positive loan amount
      this.application.loanTerm > 0 &&                // Loan term selected
      this.application.existingDebts >= 0             // Debts not negative
    );
  }

  /**
   * RESET FORM FOR NEW APPLICATION
   * Clears all fields and previous decisions
   * Like getting a fresh paper form to start over
   */
  resetForm() {
    this.application = {
      fullName: '',
      email: '',
      monthlyIncome: 0,
      requestedAmount: 0,
      existingDebts: 0,
      loanTerm: 0
    };
    this.decision = null;      // Clear previous decision
    this.submitted = false;    // Reset submission status
  }

  /**
   * CALCULATE MONTHLY PAYMENT
   * Standard bank formula used worldwide
   * @param amount - Loan amount
   * @param annualRate - Yearly interest rate
   * @param months - Loan term in months
   * @returns Monthly payment amount
   */
  calculateMonthlyPayment(amount: number, annualRate: number, months: number): number {
    const monthlyRate = annualRate / 100 / 12;  // Convert yearly rate to monthly
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(monthlyPayment * 100) / 100;  // Round to 2 decimal places
  }
}