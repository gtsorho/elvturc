import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { trigger, transition, style, animate, ɵBrowserAnimationBuilder } from '@angular/animations';
import { LoaderService } from '../../loader.service';
import axios from 'axios';
import { StoreService } from './store.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../staff/staff.service';
import { StoreReceiptComponent } from '../components/store-reciept/store-reciept.component';
import { map, Observable } from 'rxjs';

interface StoreData {
  id?: number;
  UserId: number;
  location: string;
  description: string;
  totalProducts: number;
  hasProducts: boolean;
  hasLowStock: boolean;
  storeWorth: number;
  products: any[];
}

interface productData {
  id?: number;
  name: string;
  StoreId: number;
  description: string;
  totalWorth?: number,
  updatedAt?: Date
}

interface stockData {
  id?: number;
  ProductId: number;
  quantity: number;
  unitPrice: number;
  CategoryId?: number;
  totalAmount?: number,
  updatedAt?: Date
}

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
  selector: 'app-store',
  imports: [CommonModule, FormsModule, StoreReceiptComponent],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent {
  closeReceipt() {
    this.isReceipt = false
  }


  convertDate(date: any): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  storeData: StoreData = {
    UserId: 1,
    location: '',
    description: '',
    totalProducts: 0,
    hasProducts: false,
    hasLowStock: false,
    storeWorth: 0,
    products: []
  }

  productData: productData = {
    name: '',
    StoreId: 0,
    description: '',
  }
  stockData: stockData = {
    ProductId: 0,
    quantity: 0,
    unitPrice: 0,
  }

  transactionData: transactionData = {
    date: new Date().toISOString().split('T')[0],
    type: 'debit',
    amount: 0,
    transactionId: '',
    depositor: null,
    bank: null,
    narration: '',
    balance: 0,    
  }

  staffs: any = [];
  stores: StoreData[] = [];
  isLoader: boolean = false;
  isAddStore: boolean = false;
  isAddProduct: boolean = false;
  isTransferProduct: boolean = false
  selectedStore: any
  products: productData[] = []
  categories: any[] = [];
  categoryData: any = {
    name: ''
  }
  prodCategories: any[] = [];
  date: string = new Date().toISOString().split('T')[0];
  stockEntires: any = []
  isAddItemsToStock: boolean = false
  isAddCategory: boolean = false;
  selectedProduct: any;
  storeTab: string = 'store';
  stocks: any[] = [];
  isAddStock: boolean = false;
  destinationStore: any;
  isReceipt: boolean = false;
  storeLog: string = '';
  isUpdateStore: boolean = false
  isUpdateProduct: boolean = false
  isUpdateStock: boolean = false
  isAddTransaction: boolean = false
  shouldSubmitStockAfterTransaction = false;
  stockQuantities$: { [id: string]: Observable<number> } = {};
  
  constructor(private loaderService: LoaderService, private storeService: StoreService, private staffService: StaffService) { }

  ngOnInit() {
    this.getStores();
    this.getStaff();
    this.getCategories();
  }

  createStore(e: any) {
    e.preventDefault();
    this.isLoader = true;
    const data = {
      UserId: this.storeData.UserId,
      location: this.storeData.location,
      description: this.storeData.description,
    }
    axios.post(`${this.loaderService.baseUrl}/stores`, data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
      .then(response => {
        this.storeData = {
          UserId: 1,
          location: '',
          description: '',
          totalProducts: 0,
          hasProducts: false,
          hasLowStock: false,
          storeWorth: 0,
          products: []
        }
        this.isLoader = false
        this.isAddStore = false
        this.getStores()
      })
      .catch(error => {
        console.log(error);
      });
  }

  createTransaction() {
    this.isLoader = true;
    this.transactionData.type = 'debit';
    this.transactionData.date = this.date;
    this.transactionData.narration = this.storeLog;
  
    axios.post(`${this.loaderService.baseUrl}/transactions`, this.transactionData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getCookie('token')}`,
      }
    })
      .then(response => {
        this.transactionData = {
          date: new Date().toISOString().split('T')[0],
          type: '',
          amount: 0,
          transactionId: '',
          depositor: '',
          bank: '',
          narration: '',
          balance: 0
        };
        this.isLoader = false;
        this.isAddTransaction = false;
        this.isAddItemsToStock = false;
      })
      .catch(error => {
        console.log(error);
        this.isLoader = false;
      });
  }  

  onSubmitAddEntry(e:any) {
    e.preventDefault();
    if (this.stockEntires.some((entry: any) => !entry.ProductId || !entry.CategoryId || !entry.quantity)) {
      alert('Please fill in all fields.');
      return;
    }

    const requests = this.stockEntires.map((entry: any) => {
      return axios.put(`${this.loaderService.baseUrl}/items/qty`, {
        StoreId: this.selectedStore.id,
        date: this.date,
        recipientStoreId: this.destinationStore,
        ProductId: entry.ProductId,
        CategoryId: entry.CategoryId,
        quantity: entry.quantity,
      },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.getCookie('token')}`,
          }
        });
    });

    Promise.all(requests)
      .then((responses) => {
        const extractedData = this.transformData(responses.map((response: any) => response.data)) 

        axios.post(`${this.loaderService.baseUrl}/store_log`, { log: JSON.stringify(extractedData), type:'stock', title: 'Items added to stock' },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.getCookie('token')}`,
            }
          }
        )
          .then(response => {
            this.storeLog = JSON.stringify(extractedData);
          this.createTransaction(); // ✅ call before reset
          this.isReceipt = true;

          this.resetForm(); // ✅ now it's safe to reset
          this.isAddItemsToStock = false;
          this.getStores();
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.error('Error submitting entries:', error);
      });
  }

  updateStore(e: any) {
    e.preventDefault();
    this.isLoader = true;
    const store = {
      id: this.storeData.id,
      location: this.storeData.location,
      UserId: this.storeData.UserId,
      description: this.storeData.description
    }

    axios.put(`${this.loaderService.baseUrl}/stores/${this.storeData.id}`, store,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
      .then(response => {
        this.storeData = {
          UserId: 1,
          location: '',
          description: '',
          totalProducts: 0,
          hasProducts: false,
          hasLowStock: false,
          storeWorth: 0,
          products: []
        }
        this.isLoader = false
        this.isAddStore = false
        this.isUpdateStore = false
        this.getStores()
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateProduct(e: any) {
    e.preventDefault();
    this.isLoader = true;
    const product = {
      id: this.productData.id,
      name: this.productData.name,
      description: this.productData.description,
      StoreId: this.productData.StoreId,
    }

    axios.put(`${this.loaderService.baseUrl}/products/${this.productData.id}`, product,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
      .then(response => {
        this.productData = {
          name: '',
          StoreId: 0,
          description: ''
        }
        this.isLoader = false
        this.isAddProduct = false
        this.isUpdateProduct = false
        this.getProducts()
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateStock(e: any) {
    e.preventDefault();
    this.isLoader = true;
    const stock = {
      CategoryId: this.stockData.CategoryId,
      unitPrice: this.stockData.unitPrice,
    }

    axios.put(`${this.loaderService.baseUrl}/items/${this.stockData.id}`, stock,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
      .then(response => {
        this.stockData = {
          ProductId: 0,
          quantity: 0,
          unitPrice: 0,
        }
        this.isLoader = false
        this.isAddStock = false
        this.isUpdateStock = false
        this.getItems()
      })
      .catch(error => {
        console.log(error);
      });
  }

  createProduct($event: SubmitEvent) {
    $event.preventDefault();
    this.isLoader = true;
    this.productData.StoreId = this.selectedStore.id;
    axios.post(`${this.loaderService.baseUrl}/products`, this.productData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
      .then(response => {
        this.productData = {
          name: '',
          StoreId: 0,
          description: ''
        }
        this.isLoader = false
        this.isAddProduct = false
        this.getProducts()
      })
      .catch(error => {
        console.log(error);
      });
  }

  addCategory() {
    this.isLoader = true;
    axios.post(`${this.loaderService.baseUrl}/category`, this.categoryData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
      .then(response => {
        this.categoryData = {}
        this.isLoader = false
        this.isAddCategory = false;
        this.getCategories()
      })
      .catch(error => {
        console.log(error);
      });
  }

  createStock(e: any) {
    e.preventDefault();
    this.isLoader = true;
    this.stockData.ProductId = this.selectedProduct.id;
    axios.post(`${this.loaderService.baseUrl}/items`, this.stockData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getCookie('token')}`,
        }
      }
    )
      .then(response => {
        this.stockData = {
          ProductId: 0,
          quantity: 0,
          unitPrice: 0,
        }
        this.isLoader = false
        this.isAddStock = false
        this.getItems()
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateBtnClicked(store: any) {
    this.storeData = store
    this.isUpdateStore = true
  }

  productUpdateClicked(product: any) {
    this.productData = product
    this.isUpdateProduct = true
  }

  stockUpdateClicked(stock: any) {
    this.stockData = stock
    this.stockData.CategoryId = stock.Categories[0].item_categories.CategoryId
    this.isUpdateStock = true
  }

  selectProduct(product: any) {
    this.storeTab = 'item'
    this.selectedProduct = product
    this.getItems()
  }

  selectStore(store: any) {
    this.storeTab = 'product'
    this.selectedStore = store;
    this.getProducts()
  }

  getStores() {
    this.storeService.getStores().subscribe((data: StoreData[]) => {
      this.stores = data;
      console.log(this.stores)
    });
  }

  getProducts() {
    this.storeService.getProducts(this.selectedStore.id).subscribe((data: productData[]) => {
      this.products = data;
      console.log(this.products)
    });
  }

  getCategoryByProd(id: number) {
    const ProductId = this.stockEntires[id].ProductId
    this.storeService.getCategoryByProd(ProductId).subscribe((data: any) => {
      this.prodCategories = data
    });
  }

  getItems() {
    this.storeService.getItems(this.selectedProduct.id).subscribe((data: productData[]) => {
      this.stocks = data;
    });
  }

  getCategories() {
    this.storeService.getCategories().subscribe((data: productData[]) => {
      this.categories = data;
    });
  }

  getStaff() {
    this.staffService.getStaffs().subscribe((data: any[]) => {
      this.staffs = data
    });
  }

getStockQuantity(id: any): Observable<number> {
  if (!this.stockQuantities$[id]) {
    this.stockQuantities$[id] = this.storeService.getItems(id).pipe(
      map((data: stockData[]) => data.reduce((sum, item) => sum + item.quantity, 0))
    );
  }
  return this.stockQuantities$[id];
}

  addCommasToNumber(value: number | string | undefined): string {
    const num = Number(value);
    if (isNaN(num)) return '0.00'; // fallback for invalid values
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  openModal() {
    this.isAddStore = true;
  }

  promptTransactionDecision() {
    this.isAddItemsToStock = false
    this.isAddTransaction = true;
  }

  skipTransaction(e:any) {
    this.isAddTransaction = false;
    this.onSubmitAddEntry(e);
  }

  closeModal() {
    this.isAddStore = false;
  }
  addProductField() {
    this.stockEntires.push({
      ProductId: null,
      CategoryId: null,
      quantity: null,
    });
  }

  removeProductField(index: number) {
    this.stockEntires.splice(index, 1);
    console.log('Updated Stock Entries:', this.stockEntires);
  }

  resetForm() {
    this.date = '';
    this.selectedStore = null;
    this.stockEntires = [];
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

  transformData(input:any) {
    return {
      date:input[0].data.date,
      RecipientId: input[0].data.recipientStore?.id || null,
      soreId: input[0].data.storeId.UserId,
      store: {
        location: input[0].data.storeId.location, 
      },
      recipient: {
        location: input[0].data.recipientStore?.id || null, 
      },
      Items: input.map((item:any) => {
        const { updatedItem } = item.data;
          return{
            Categories: [
              {
                id: updatedItem.Categories[0].id,
                name: updatedItem.Categories[0].name,
              },
            ],
            Product: {
              id: updatedItem.Product.id,
              name: updatedItem.Product.name,
              description: updatedItem.Product.description,
              StoreId: updatedItem.Product.StoreId,
            },
            item_invoice: {
              quantity: updatedItem.quantity,
              unitPrice: updatedItem.unitPrice,
              subtotal: updatedItem.quantity * updatedItem.unitPrice,
            },
          }
      }),
    };
}
}