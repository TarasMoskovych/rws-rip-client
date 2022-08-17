import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticComponent } from './statistic.component';
import { UadataService } from './services';

@NgModule({
  declarations: [
    StatisticComponent,
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
