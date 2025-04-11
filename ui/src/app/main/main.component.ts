import { CommonModule } from '@angular/common';
import { Component, Renderer2, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoaderService } from '../loader.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  isAdmin: boolean = false;
  isSidebarOpen: boolean = false;
  isDarkMode: boolean = true;
  private tokenCheckSubscription!: Subscription;

  constructor(private renderer: Renderer2, private loaderService: LoaderService, public router: Router) {
    this.loaderService.isDarkMode$.subscribe((res) => {
      this.isDarkMode = res;
    });
  }

  ngOnInit() {
    // this.checkTokenExpiration();
    // this.verifyAdmin();
    // this.setIntervalCheckToken();
  }


  toggleSidebar(flag: boolean): void {
    this.isSidebarOpen = flag;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.renderer.setAttribute(document.body, 'class', this.isDarkMode ? 'dark' : '');
  }

  checkTokenExpiration() {
    if (this.loaderService.isTokenExpired()) {
      console.warn('Token expired. Redirecting...');
      this.router.navigate(['']);
    } else {
      console.log('Token valid.');
    }
  }

  setIntervalCheckToken() {
    this.tokenCheckSubscription = interval(1200000).subscribe(() => {
      this.checkTokenExpiration();
    });
  }

  clearToken() {
    this.setCookie('token', '', 1);
    this.router.navigate(['']);
  }

  verifyAdmin() {
    const data = this.loaderService.getDecodedToken();
    this.isAdmin = data?.role === 'admin';
  }

  getCookie(cname: string) {
    const name = `${cname}=`;
    const ca = document.cookie.split(';');
    for (const c of ca) {
      const cookie = c.trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length);
      }
    }
    return '';
  }
  
  logout(){
    this.setCookie('token', '', 0.01);
    this.router.navigate(['']);
  }

  setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
  }
}
