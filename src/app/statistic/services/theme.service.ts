import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from 'src/app/app.module';

@Injectable()
export class ThemeService {
  private readonly sessionKey = 'uadata-client:theme';
  private darkMode!: boolean;

  constructor(
    @Inject(LOCAL_STORAGE) private readonly storage: Storage,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
  }

  init(): void {
    this.darkMode = this.storage.getItem(this.sessionKey) === Theme.DARK;
    this.activateTheme();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    this.activateTheme();
    this.storage.setItem(this.sessionKey, this.darkMode ? Theme.DARK : Theme.LIGHT);
  }

  private activateTheme(): void {
    this.document.documentElement.setAttribute('theme', this.darkMode ? Theme.LIGHT : Theme.DARK);
  }
}

enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}
