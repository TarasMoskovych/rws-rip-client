import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IStatistic, ThemeService } from '../../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() statistic!: IStatistic;

  constructor(private readonly themeService: ThemeService) {
  }

  onToggle() {
    this.themeService.toggleTheme();
  }
}
