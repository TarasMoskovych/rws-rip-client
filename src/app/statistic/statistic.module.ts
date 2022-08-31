import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticComponent } from './statistic.component';
import { ThemeService, UadataService } from './services';
import { HeaderComponent, LoaderComponent, StatisticItemComponent } from './components';
import { ContentAnimateDirective } from './directives';

@NgModule({
  declarations: [
    StatisticComponent,
    StatisticItemComponent,
    LoaderComponent,
    ContentAnimateDirective,
    HeaderComponent,
  ],
  providers: [
    ThemeService,
    UadataService,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    StatisticComponent,
  ],
})
export class StatisticModule {
  constructor(private readonly themeService: ThemeService) {
    this.themeService.init();
  }
}
