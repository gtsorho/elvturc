import { Component, Renderer2  } from '@angular/core';
import { LoaderService } from '../loader.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';

interface user {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isDarkMode = true;
  userData: user ={
    username: '',
    password: ''
  }

  constructor(private renderer: Renderer2, private loaderService: LoaderService, private router: Router) {
    this.loaderService.isDarkMode$.subscribe((res) => {
      this.isDarkMode = res;
    });
  }
  login(){
    axios.post(`${this.loaderService.baseUrl}/login`, this.userData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
     .then(response => {
      this.setCookie('token', response.data.token, 0.01);
      this.router.navigate(['/main/dashboard']);
    })
     .catch(error => {
        console.log(error);
      });
  }

   toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark');  
    } else {
      this.renderer.removeClass(document.body, 'dark');
    }
  }

  setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }
}
