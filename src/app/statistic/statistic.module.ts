import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticComponent } from './statistic.component';
import { UadataService } from './services';
import { LoaderComponent, StatisticItemComponent } from './components';
import { ContentAnimateDirective } from './directives';

@NgModule({
  declarations: [
    StatisticComponent,
    StatisticItemComponent,
    LoaderComponent,
    ContentAnimateDirective,
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
