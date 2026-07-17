import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../services/character-service';
import { ActivatedRoute } from '@angular/router';
import { CharacterDTO } from '../../models/CharacterDTO';

@Component({
  selector: 'app-character-details',
  imports: [],
  template: `
    @if (character) {
      <div class="card">
        <img src="{{ character.imageUrl }}" />
        <div class="card-body">
          <h5 class="card-title text-align-center">Full name: {{ character.fullName }}</h5>
          <div [class]="character.family">
            <p class="card-text">Family: {{ character.family }}</p>
          </div>
          <p class="card-text">Title: {{ character.title }}</p>
        </div>
      </div>
    }
  `,
  styles: '',
})
export class CharacterDetails implements OnInit {
  characterId: string | null = null;
  character: CharacterDTO | null = null;

  constructor(
    private characterService: CharacterService,
    private activatedRoute: ActivatedRoute,
  ) {}

  async ngOnInit(): Promise<void> {
    this.characterId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.characterId) {
      /**
       *  Ricevo l'id in stringa dalla querystring nell'url, casto in number
       *  per effettuare la chiamata al service
       */
      const characterIdToNumber = parseInt(this.characterId);

      try {
        const result = await this.characterService.getCharacterById(characterIdToNumber);
        this.character = result;
      } catch {
        throw 'Errore nel recupero del personaggio';
      }
    }
  }
}
