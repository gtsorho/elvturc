import { Injectable, NgZone  } from '@angular/core';
import { BehaviorSubject, interval, catchError, of, switchMap, startWith, map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
// import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private jwtHelper: JwtHelperService = new JwtHelperService();
  baseUrl = 'http://localhost:3000/api'

  private darkMode = new BehaviorSubject<boolean>(true); 
  isDarkMode$ = this.darkMode.asObservable();

  private onlineStatus = new BehaviorSubject<boolean>(false);
  public isOnline$ = this.onlineStatus.asObservable();

  constructor(private http: HttpClient, private ngZone: NgZone) {
    // Initial check
    this.checkConnection();

    // Listen to browser online/offline events
    window.addEventListener('online', () => {
      this.ngZone.run(() => this.onlineStatus.next(true));
    });

    window.addEventListener('offline', () => {
      this.ngZone.run(() => this.onlineStatus.next(false));
    });

    // Start periodic check every 30s
    this.ngZone.runOutsideAngular(() => {
      interval(30000).pipe(
        startWith(0), // triggers immediately
        switchMap(() => this.checkPing())
      ).subscribe(status => {
        this.ngZone.run(() => this.onlineStatus.next(status));
      });
    });
  }

  public get currentStatus(): boolean {
    return this.onlineStatus.value;
  }

  private checkConnection() {
    this.checkPing().subscribe(status => {
      this.onlineStatus.next(status);
    });
  }

  private checkPing() {
    return this.http.get('https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png', {
      responseType: 'blob'
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
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
