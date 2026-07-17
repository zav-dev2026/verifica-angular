import { Component, Input } from '@angular/core';
import { CharacterDTO } from '../../models/CharacterDTO';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-character',
  imports: [RouterLink],
  template: `@if (character) {
    <div class="card" style="width: 18rem;">
      <img src="{{ character.imageUrl }}" class="card-img-top" />
      <div class="card-body">
        <a [routerLink]="'/characters/' + character.id">
          <div [class]="character.family">
            <h5 class="card-title">{{ character.fullName }}</h5>
          </div>
        </a>
      </div>
    </div>
  }`,
  styleUrl: './character.css',
})
export class Character {
  @Input() character: CharacterDTO | null = null;
}
