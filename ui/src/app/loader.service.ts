import { Injectable, NgZone  } from '@angular/core';
import { BehaviorSubject,  interval, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private jwtHelper: JwtHelperService = new JwtHelperService();
  baseUrl = 'http://localhost:3000/api'

  private darkMode = new BehaviorSubject<boolean>(true); 
  isDarkMode$ = this.darkMode.asObservable();

  private onlineStatus = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.onlineStatus.asObservable();

  private checkInterval = 30000; // 30 seconds
  private pingUrl = 'https://clients3.google.com/generate_204'; // reliable Google URL with 204 response

  constructor(private http: HttpClient, private ngZone: NgZone) {
    // Native browser online/offline events
    window.addEventListener('online', () => this.setOnlineStatus(true));
    window.addEventListener('offline', () => this.setOnlineStatus(false));

    // Polling for real connectivity
    this.startPolling();
  }

  private startPolling() {
    interval(this.checkInterval).subscribe(() => {
      this.http.get(this.pingUrl, { responseType: 'text' }).pipe(
        map(() => true),
        catchError(() => of(false))
      ).subscribe(isOnline => {
        this.setOnlineStatus(isOnline);
      });
    });
  }

  private setOnlineStatus(status: boolean) {
    this.ngZone.run(() => this.onlineStatus.next(status));
  }

  public get currentStatus(): boolean {
    return this.onlineStatus.value;
  }


  setDarkMode(isDark: boolean): void {
    this.darkMode.next(isDark);
  }

  getDarkMode(): boolean {
    return this.darkMode.value;
  }
  
  getDecodedToken(): any {
    const token = this.getCookie('token');
    if (token) {
      try {
        return  jwtDecode(token);
      } catch (Error) {
        return null;
      }
    }
    return null;
  }

  // Method to get specific data from the token
  getTokenData(key: string): any {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      return decodedToken[key];
    }
    return null;
  }

  // Method to check if the token is expired
  isTokenExpired(): boolean {
    const token = this.getCookie('token');
    return token ? this.jwtHelper.isTokenExpired(token) : true;
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
