import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { LoanApplicationComponent } from './components/loan-application/loan-application.component';
import { CommonModule } from '@angular/common';

/**
 * MAIN APPLICATION COMPONENT - THE ENTIRE LOAN SYSTEM
 * This is the root component that holds everything together
 * Like the main building that contains all the bank departments
 */
@Component({
  selector: 'app-root',           // This is the main tag in index.html
  standalone: true,               // Uses modern Angular (no NgModule)
  imports: [CommonModule, FormsModule, LoanApplicationComponent], // What we need to run
  templateUrl: './app.html',      // The HTML template file
  styleUrl: './app.css'           // The CSS styling file
})
export class App {
  title = 'Thando\'s Pepkor Loan System';  // bank's name - shows in header
}