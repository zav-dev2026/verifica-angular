import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../services/character-service';
import { ActivatedRoute } from '@angular/router';
import { CharacterDTO } from '../../models/CharacterDTO';

/** altri esempi di interpolazione nel template */
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
  /**
   * proprietà inizializzate a null, perchè poi
   * valorizzate nella onInit
   */
  characterId: string | null = null;
  character: CharacterDTO | null = null;

  /**
   * Iniezione di servizio, e di componente per estrarre i valori
   * della querystring
   */
  constructor(
    private characterService: CharacterService,
    private activatedRoute: ActivatedRoute,
  ) {}

  /**
   * Chiamo la getById per valorizzare this.character
   */
  async ngOnInit(): Promise<void> {
    this.characterId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.characterId) {
      try {
        const result = await this.characterService.getCharacterById(this.characterId);
        this.character = result;
      } catch {
        throw 'Errore nel recupero del personaggio';
      }
    }
  }
}
