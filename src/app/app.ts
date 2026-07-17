import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref],
  template: `
    <div class="container d-flex justify-content-between">
      <h1>Benvenuti su Game of Thrones wiki</h1>
      <button class="btn btn-primary">
        <a [routerLink]="'/'" class="anchor"> Torna alla home </a>
      </button>
    </div>

    <router-outlet />
  `,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('game-of-thrones-app');
}
