import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '../../loader.service';
import axios from 'axios';
import { FormsModule } from '@angular/forms';
import { SettingsService } from './settings.service';

interface accountData {
  title: string;
  description: string;
  openingBalance: number;
  active:boolean; 
}
@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  accountData: accountData = {
    title: '',
    description: '',
    openingBalance: 0,
    active:false,
  }

  accounts: accountData[] = [];
  isLoader: boolean = false;
  isAddAccount: boolean = false;

  constructor(private loaderService: LoaderService, private settingsService:SettingsService ){}

  ngOnInit() {
    this.getAccounts();
  }

  createAccount(e:any){
    e.preventDefault();
    this.isLoader = true;
    axios.post(`${this.loaderService.baseUrl}/accounts`, this.accountData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
     .then(response => {
      this.accountData = {
        title: '',
        description: '',
        openingBalance: 0,
        active:false,
      }
      this.isLoader = false
      this.isAddAccount = false
      this.getAccounts()
    })
     .catch(error => {
        console.log(error);
      });
  }

  toggleActive(account: any) {
    account.active = !account.active;
    const data = {
        title: account.title,
        description: account.description,
        openingBalance: account.openingBalance,
        active: account.active,
    }

    this.isLoader = true;
    axios.put(`${this.loaderService.baseUrl}/accounts/${account.id}`, data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
     .then(response => {
      this.accountData = {
        title: '',
        description: '',
        openingBalance: 0,
        active:false,
      }
      this.isLoader = false
      this.isAddAccount = false
      this.getAccounts()
    })
     .catch(error => {
        console.log(error);
      });
  }

  getAccounts(){
    this.settingsService.getAccounts().subscribe((data: accountData[]) => {
      this.accounts = data;
    });
  }

  openModal() {
    this.isAddAccount = true;
  }

  closeModal() {
    this.isAddAccount = false;
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
}
