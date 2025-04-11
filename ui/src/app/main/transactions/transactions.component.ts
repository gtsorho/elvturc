import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '../../loader.service';
import axios from 'axios';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from './transactions.service';
import { SettingsService } from '../settings/settings.service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import moment, { Moment } from 'moment';

interface transactionData {
  date: string;
  type: string;
  amount: number;
  transactionId: string;
  depositor?: string | null;
  bank?: string | null;
  narration: string;
  balance: number;
  id?:number;
}
@Component({
  selector: 'app-transactions',
  imports: [CommonModule, FormsModule, NgxDaterangepickerMd],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {
  isCreditAccount:boolean = true
  transactions: transactionData[] = [];
  isLoader: boolean = false;
  isAddTransaction: boolean = false;
  isConfirmSubmit: boolean = false;
  account:any = {}
  searchValue: string = ''
  hasLoadedInitially = false;

  transactionData: transactionData = {
    date: new Date().toISOString().split('T')[0],
    type: this.isCreditAccount ? 'credit' : 'debit',
    amount: 0,
    transactionId: '',
    depositor: null,
    bank: null,
    narration: '',
    balance: 0,    
  }

    selected = { startDate: moment().subtract(29, 'days'), endDate: moment() };
    ranges: any = {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [
        moment().subtract(1, 'month').startOf('month'),
        moment().subtract(1, 'month').endOf('month'),
      ],
      'Last 3 Month': [
        moment().subtract(3, 'month').startOf('month'),
        moment().subtract(1, 'month').endOf('month'),
      ],
    };

  constructor(private loaderService: LoaderService, private transactionsService:TransactionsService, private settingsService:SettingsService ){}

  ngOnInit() {
    this.getTransactions();
    this.activeAccount()

    setTimeout(() => this.hasLoadedInitially = true, 100);

  }

  createTransaction(){
    this.isLoader = true;
    this.transactionData.type = this.isCreditAccount ? 'credit' : 'debit'
    axios.post(`${this.loaderService.baseUrl}/transactions`, this.transactionData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
     .then(response => {
      this.transactionData = {
        date: new Date().toISOString().split('T')[0],
        type: '',
        amount: 0,
        transactionId: '',
        depositor: '',
        bank: '',
        narration: '',
        balance: 0,
        // AccountId: ''
      }
      this.isLoader = false
      this.isAddTransaction = false
      this.getTransactions()
    })
     .catch(error => {
        console.log(error);
      });
  }

  getTransactions(){
    this.transactionsService.getTransactions().subscribe((data: transactionData[]) => {
      this.transactions = data;
    });
  }

  activeAccount(){
    this.settingsService.activeAccount().subscribe((data: transactionData[]) => {
      this.account = data;
    });
  }
  chosenDate() {
    if (!this.hasLoadedInitially) return;
    this.search()
  }


  addCommasToNumber(value: number | string | undefined): string {
    const num = Number(value);
    if (isNaN(num)) return '0.00'; // fallback for invalid values
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  search(){
    axios.get(`${this.loaderService.baseUrl}/transactions/search?searchValue=${this.searchValue}&startDate=${this.selected.startDate}&endDate=${this.selected.endDate}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
     .then(response => {
      this.transactions = response.data
    })
     .catch(error => {
        console.log(error);
      });
  }


  confirmSubmission(e:any) {
    e.preventDefault();
    this.isConfirmSubmit = true;
  }

  submitTransaction() {
    this.isConfirmSubmit = false;
    this.isLoader = true;
    this.createTransaction();
  }
  openModal() {
    this.isAddTransaction = true;
  }

  closeModal() {
    this.isAddTransaction = false;
  }

  getCookie(cname: string): string {
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  convertDate(date: any): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
}
