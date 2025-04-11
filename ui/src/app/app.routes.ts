import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { StoreComponent } from './main/store/store.component';
import { StaffComponent } from './main/staff/staff.component';
import { RecordsComponent } from './main/records/records.component';
import { InvoiceComponent } from './main/invoice/invoice.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { SettingsComponent } from './main/settings/settings.component';
import { TransactionsComponent } from './main/transactions/transactions.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'main', component: MainComponent,
        children: [
            { path: 'store', component: StoreComponent },
            { path: 'staff', component: StaffComponent },
            { path: 'records', component: RecordsComponent },
            { path: 'invoices', component: InvoiceComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'transactions', component: TransactionsComponent },




            // { path: 'settings', component: SettingsComponent },
            // { path: '**', component: PageNotFoundComponent }
        ]
    },

];
