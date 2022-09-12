import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ServiceWorkerService } from './services/service-worker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(private readonly serviceWorker: ServiceWorkerService) { }

  ngOnInit(): void {
    this.serviceWorker.init();
  }
}
