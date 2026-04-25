import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="app-wrapper">
      <app-header />
      <main class="main-content">
        <div class="container">
          <router-outlet />
        </div>
      </main>
    </div>
  `
})
export class AppComponent {}
