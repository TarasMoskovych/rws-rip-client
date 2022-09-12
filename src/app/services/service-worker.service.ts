import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush, SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { EMPTY, filter, from, Observable, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService {
  private readonly sessionKey = 'uadata-client:subscriptions';

  constructor(
    private readonly http: HttpClient,
    private readonly swUpdate: SwUpdate,
    private readonly swPush: SwPush,
  ) { }

  init(): void {
    if (!this.swUpdate.isEnabled) {
      console.warn('Service worker is not supported.');
      return;
    }

    this.initUpdate();
    this.initPush().subscribe();
  }

  private initUpdate(): void {
    this.swUpdate.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
    ).subscribe(() => window.location.reload());
  }

  private initPush(): Observable<void> {
    return from(this.swPush.requestSubscription({ serverPublicKey: environment.vapidPublicKey })).pipe(
      switchMap((sub: PushSubscription) => this.addSubscription(sub.toJSON())),
    );
  }

  private addSubscription(sub: PushSubscriptionJSON): Observable<void> {
    const data = JSON.parse(localStorage.getItem(this.sessionKey) as string) as PushSubscription;

    if (data?.endpoint === sub.endpoint) {
      return EMPTY;
    }

    return this.http.post<void>(`${environment.proxyServer}/api/subscription`, sub).pipe(
      tap(() => localStorage.setItem(this.sessionKey, JSON.stringify(sub))),
    );
  }
}
