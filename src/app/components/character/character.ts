import { Component, Input } from '@angular/core';
import { CharacterDTO } from '../../models/CharacterDTO';
import { RouterLink } from '@angular/router';

/**
 * Nel template, ci sono diversi esempi di interpolazione {{}},
 * posso accedere tranquillamente alle proprietà
 * dell'oggetto character di tipo CharacterDTO
 * perchè prima ho dichiarato il modello dati
 */

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
  styles: '',
})
export class Character {
  /** variabile non valorizzata dal componente stesso.
   * Ma ricevuta da un componente padre tramite property binding
   */
  @Input() character: CharacterDTO | null = null;
}
