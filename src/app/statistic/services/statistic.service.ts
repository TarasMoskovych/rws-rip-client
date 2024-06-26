import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class StatisticService {

  constructor(private readonly http: HttpClient) { }

  getData(): Observable<IStatistic> {
    return this.http.get<IStatistic>(`${environment.proxyServer}/api/statistic`);
  }
}

export interface IStatistic {
  currentDay: number;
  lastUpdated: string;
  data: IStatisticItem[];
}

export interface IStatisticItem {
  id: string;
  title: string;
  long_title: string;
  total: number;
  current: number;
  icon: string;
}
