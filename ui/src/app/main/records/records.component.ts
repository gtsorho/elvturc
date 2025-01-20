import { Component } from '@angular/core';
import { RecordsService } from './records.service';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { StoreReceiptComponent } from "../components/store-reciept/store-reciept.component";

interface records{
  id?: number;
  userId: number;
  log:string
}

@Component({
  selector: 'app-records',
  imports: [CommonModule, StoreReceiptComponent],
  templateUrl: './records.component.html',
  styleUrl: './records.component.scss'
})
export class RecordsComponent {
closeModal() {
  this.isReceipt = false
}


  constructor(private recordsService:RecordsService){}

  records: any = [];
  isReceipt:boolean = false
  log:any = {};

  ngOnInit(): void {
    this.getRecords();
  }


  getRecords() {
    this.recordsService.getRecords()
      .pipe(map((data:any) => {
          return data.map((record: any) => {
            try {
              const parsedRecord = JSON.parse(record.log);

              return parsedRecord;
            } catch (e) {
              console.error('Invalid JSON:', record);
              return null; 
            }
          }).filter((record:any) => record !== null); // Remove any null entries
        })
      )
      .subscribe(parsedRecords => {
        this.records = parsedRecords;
        console.log(this.records)
      });
  }
  stringify(record:any) {
    this.log = JSON.stringify(record)
  }
  convertDate(date:any) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  isArray(value: any) {
    return Array.isArray(value)
  }
}

