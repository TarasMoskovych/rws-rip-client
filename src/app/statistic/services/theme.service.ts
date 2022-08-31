import { Injectable } from '@angular/core';

@Injectable()
export class ThemeService {
  private readonly sessionKey = 'uadata-client:theme';
  private darkMode!: boolean;

  init(): void {
    this.darkMode = localStorage.getItem(this.sessionKey) === Theme.DARK;
    this.activateTheme();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    this.activateTheme();
    localStorage.setItem(this.sessionKey, this.darkMode ? Theme.DARK : Theme.LIGHT);
  }

  private activateTheme(): void {
    document.documentElement.setAttribute('theme', this.darkMode ? Theme.LIGHT : Theme.DARK);
  }
}

enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}
