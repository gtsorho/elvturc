import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxDaterangepickerMd],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ui';
}
