import { Injectable } from '@angular/core';
import { LoaderService } from '../../loader.service';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private loaderService: LoaderService) { }
  
  getStoreSummary(startDate:any, endDate:any): Observable<any> {
    return new Observable((observer) => {
      axios.get(`${this.loaderService.baseUrl}/dashboard/storeSummary?storeId=1&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.getCookie('token')}`,
          }
        }
      ).then((response) => {
        observer.next(response.data);
        observer.complete();
      })
        .catch((error: any) => {
          console.log(error);
        });
    })
  }

  getInvoiceSummary(startDate:any, endDate:any): Observable<any> {
    return new Observable((observer) => {
      axios.get(`${this.loaderService.baseUrl}/dashboard/invoice-summary?startDate=${startDate}&endDate=${endDate}&groupBy=month`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.getCookie('token')}`,
          }
        }
      ).then((response) => {
        observer.next(response.data);
        observer.complete();
      })
        .catch((error: any) => {
          console.log(error);
        });
    })
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
