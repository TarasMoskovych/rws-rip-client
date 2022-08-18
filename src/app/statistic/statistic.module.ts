import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticComponent } from './statistic.component';
import { UadataService } from './services';
import { StatisticItemComponent } from './components';

@NgModule({
  declarations: [
    StatisticComponent,
    StatisticItemComponent,
  ],
  providers: [
    UadataService,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    StatisticComponent,
  ],
})
export class StatisticModule { }
