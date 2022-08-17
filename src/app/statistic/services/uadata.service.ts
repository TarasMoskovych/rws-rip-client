import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class UadataService {

  constructor(private readonly http: HttpClient) { }

  getData() {
    return this.http.get<IStatistic[]>(`${environment.proxyServer}/api/statistic`);
  }
}

export interface IStatistic {
  title: string;
  description: string;
  data: Array<{at: string; val: number}>;
}
