import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-store-receipt',
  imports: [CommonModule],
  templateUrl: './store-receipt.component.html',
  styleUrl: './store-receipt.component.scss'
})
export class StoreReceiptComponent {
  @Input() log!: string;

  businessName!: string;
  address!: string;
  receiptNo!: string;
  date!: string;
  source!: string;
  destination!: string;
  items: { name: string; category: string; quantity: number; total: number }[] = [];
  subTotal!: number;
  contactInfo!: { email?: string; phone: string };
  amountPaid: any;

  ngOnInit(): void {
    this.destructure();
  }

  destructure() {
    const log = JSON.parse(this.log);

    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    this.businessName = "ELVTURC GH LTD"; // Replace with the correct source if dynamic
    this.address = "Adj. Ansco School, Ashiaman - Accra"; // Replace with the correct source if dynamic
    this.date = new Date(log.date || log[0]?.data.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

      if(log.id){
        this.receiptNo = `IVC-${this.dateToString(log.date)}/${log.id}`;
      }else{
        this.receiptNo = `REC-${this.dateToString(log.date)}`;
      }

      this.source = log.User?.username || log.store.location;
      this.destination = log.recipient.username;

      this.items = log.Items.map((entry: any) => {
        const product = entry.Product.name;
        const category = entry.Categories[0]?.name || "Unknown";
        const quantity = entry.item_invoice.quantity;
        const total = entry.item_invoice?.unitPrice ||entry.unitPrice * quantity;

        return {
          name: product,
          category: category,
          quantity: quantity,
          total: total
        };
      });

      this.subTotal = this.items.reduce((sum, item) => sum + item.total, 0);
      this.amountPaid = log.amount_paid


    this.contactInfo = {
      phone: "+233 24 415 1241" 
    };
  }

  isArray(value: any) {
    return Array.isArray(value)
  }
  dateToString(value: any) {
    const formattedDate = new Date(value)
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '');

    return formattedDate
  }
}
