import { Injectable } from '@angular/core';
import { LoaderService } from '../../loader.service';
import { Observable } from 'rxjs';
import axios from 'axios';


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private loaderService: LoaderService) { }

  getStores(): Observable<any> {
    return new Observable((observer) => {
      axios.get(`${this.loaderService.baseUrl}/stores`,
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

  getStoresExcept(id:any): Observable<any> {
    return new Observable((observer) => {
      axios.get(`${this.loaderService.baseUrl}/stores/except/${id}`,
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

  getProducts(id:any): Observable<any> {
    return new Observable((observer) => {
      axios.get(`${this.loaderService.baseUrl}/products/all/${id}`,
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

  getItems(id:any): Observable<any> {
    return new Observable((observer) => {
      axios.get(`${this.loaderService.baseUrl}/items/all/${id}`,
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

  getItemsByStore(id:any): Observable<any> {
    return new Observable((observer) => {
      axios.get(`${this.loaderService.baseUrl}/items/by_store/${id}`,
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

  getCategoryByProd(id:any): Observable<any> {
    return new Observable((observer) => {
      axios.get(`${this.loaderService.baseUrl}/categorybyproducts/${id}`,
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

  getCategories(): Observable<any> {
    return new Observable((observer) => {
      axios.get(`${this.loaderService.baseUrl}/category`,
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
