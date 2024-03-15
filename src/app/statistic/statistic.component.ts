import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { scaleIn } from './animations';
import { IStatistic, StatisticService } from './services';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [scaleIn],
})
export class StatisticComponent implements OnInit {
  statistic$!: Observable<IStatistic>;

  constructor(
    private readonly statisticService: StatisticService,
  ) { }

  ngOnInit(): void {
    this.statistic$ = this.statisticService.getData().pipe(
      map((statistic) => ({
        ...statistic,
        data: statistic.data.slice(0, 14),
      })),
    );
  }
}
