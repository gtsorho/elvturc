import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '../../loader.service';
import axios from 'axios';
import { FormsModule } from '@angular/forms';
import { StaffService } from './staff.service';

interface StaffData {
  username: string;
  phone: string;
  role: string;
  password: string | null;
  confirmPassword: string | null;

}

@Component({
  selector: 'app-staff',
  imports: [CommonModule, FormsModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})

export class StaffComponent {
  staffData: StaffData = {
    username: '',
    phone: '',
    role: 'sales',
    password: null,
    confirmPassword: null
  }

  staffs: StaffData[] = [];
  isLoader: boolean = false;
  isAddStaff: boolean = false;

  constructor(private loaderService: LoaderService, private staffService:StaffService){}

  ngOnInit() {
    this.getStaffs();
  }

  createStaff(e:any){
    e.preventDefault();
    this.isLoader = true;
    axios.post(`${this.loaderService.baseUrl}/users`, this.staffData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
     .then(response => {
      this.staffData = {
        username: '',
        phone: '',
        role: '',
        password: '',
        confirmPassword: ''
      }
      this.isLoader = false
      this.isAddStaff = false
      this.getStaffs()
    })
     .catch(error => {
        console.log(error);
      });
  }

  getStaffs(){
    this.staffService.getStaffs().subscribe((data: StaffData[]) => {
      this.staffs = data;
      console.log(this.staffs);
    });
  }

  openModal() {
    this.isAddStaff = true;
  }

  closeModal() {
    this.isAddStaff = false;
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
