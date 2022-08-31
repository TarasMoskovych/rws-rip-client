import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IStatisticItem } from '../../services';

@Component({
  selector: 'app-statistic-item',
  templateUrl: './statistic-item.component.html',
  styleUrls: ['./statistic-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticItemComponent {
  @Input() item!: IStatisticItem;
}
