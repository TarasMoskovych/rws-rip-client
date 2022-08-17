import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IStatistic, UadataService } from './services';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticComponent implements OnInit {
  statistic$!: Observable<IStatistic[]>;

  constructor(
    private readonly uadataService: UadataService,
  ) { }

  ngOnInit(): void {
    this.statistic$ = this.uadataService.getData();
  }
}
