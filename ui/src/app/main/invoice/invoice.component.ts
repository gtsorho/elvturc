import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from './invoice.service';
import { StoreReceiptComponent } from '../components/store-reciept/store-reciept.component';
import { StaffService } from '../staff/staff.service';
import { StoreService } from '../store/store.service';
import axios from 'axios';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule, FormsModule, StoreReceiptComponent],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent {


  date: string = new Date().toISOString().split('T')[0];
  destination: number = 1
  stockEntires: any = []
  products: any = []
  prodCategories: any[] = [];
  selectedStore: any
  isLoader: boolean = false;
  isAddInvoice: boolean = false
  invoices: any;
  invoiceLog: any = {};
  isReceipt: boolean = false
  staffs: any;
  isAddItemsToStock: boolean = false
  stores: any;
  items: any;
  amount_paid: number = 0;
  subTotal: number = 0;
  balancePaid: number = 0;
  isUpdateInvoice: boolean = false;
  selectedInvoice: any;
  msgErr: string = ''
;


  constructor(private invoiceService: InvoiceService, private staffService: StaffService, private storeService: StoreService, private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.getInvoice();
    this.getStaff()
  }

  selectStore() {
    this.storeService.getItemsByStore(this.selectedStore).subscribe(res => {
      this.items = res
    })
  }

  createInvoice($event: SubmitEvent) {
    const data = {
      date: this.date,
      items: this.stockEntires,
      amount_paid: this.amount_paid,
      RecipientId: this.destination
    }

    $event.preventDefault();
    this.isLoader = true;
    axios.post(`${this.loaderService.baseUrl}/invoice`, data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
      .then(response => {

        this.isLoader = false
        this.isAddInvoice = false
        this.getInvoice()
      })
      .catch(error => {
        this.msgErr = error.response?.data?.error || 'An unexpected error occurred';
        this.isLoader = false;
        
        setTimeout(() => {
          this.msgErr = '';
        }, 4000);
      });

  }
  updateBtnClicked(invoice: any) {
    this.selectedInvoice = invoice;
    this.selectedInvoice.ref = `IVC-${this.dateToString(invoice.date)}/${invoice.id}`;
  }

  updateInvoice($event: any) {  
      $event.preventDefault();
      this.isLoader = true;
      axios.put(`${this.loaderService.baseUrl}/invoice/${this.selectedInvoice.id}`, {amount_paid: parseFloat(this.balancePaid.toString())},
        {
          headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getCookie('token')}`,
          }
        }
      )
        .then(response => {
      
          this.isLoader = false
          this.isUpdateInvoice = false
          this.getInvoice()
        })
        .catch(error => {
          console.log(error);
        });
  
    }


  selectInvoice(invoice: any) {
    this.invoiceLog = JSON.stringify(invoice);
    this.isReceipt = true;
  }

  addCommasToNumber(value: number | string): string {
    const num = Number(value);
    if (isNaN(num)) return '0.00'; // fallback for invalid values
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  getInvoice() {
    this.invoiceService.getInvoices().subscribe(res => {
      this.invoices = res.data;
    });
  }
  
  getStores() {
    this.storeService.getStoresExcept(this.destination).subscribe(res => {
      console.log(res)
      this.stores = res;
    });
  }

  addProductField() {
    this.stockEntires.push({
      itemId: null,
      quantity: null,
    });
  }

  calculateSubtotal(): void {
    this.subTotal = this.stockEntires.reduce((total: any, entry: any) => {
      const selectedItem = this.items.find((item: any) => item.id === parseInt(entry.itemId));
      return total + (selectedItem ? selectedItem.unitPrice.toFixed(2) * entry.quantity : 0);
    }, 0);
  }

  onQuantityChange() {
    this.calculateSubtotal();
  }

  getCategoryByProd(id: number) {
    const ProductId = this.stockEntires[id].ProductId
    this.storeService.getCategoryByProd(ProductId).subscribe((data: any) => {
      this.prodCategories = data
    });
  }

  removeProductField(index: number) {
    this.stockEntires.splice(index, 1);
    console.log('Updated Stock Entries:', this.stockEntires);
  }

  getProducts() {
    this.storeService.getProducts(this.selectedStore.id).subscribe((data: any) => {
      this.products = data;
    });
  }

  getStaff() {
    this.staffService.getStaffs().subscribe(res => {
      this.staffs = res
    });
  }

  closeModal() {
    this.isReceipt = false
  }

  convertDate(date: any) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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


  dateToString(value: any) {
    const formattedDate = new Date(value)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');

    return formattedDate
  }
}
