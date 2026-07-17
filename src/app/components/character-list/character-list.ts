import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../services/character-service';
import { CharacterDTO } from '../../models/CharacterDTO';
import { Character } from '../character/character';

@Component({
  selector: 'app-character-list',
  imports: [Character],
  template: `
    <div class="row g-4">
      @for (character of characterList; track character.id) {
        <div class="col">
          <app-character [character]="character"></app-character>
        </div>
      }
    </div>
  `,
  styles: '',
})
export class CharacterList implements OnInit {
  public characterList: CharacterDTO[] = [];

  constructor(private characterService: CharacterService) {}

  async ngOnInit(): Promise<void> {
    try {
      const result = await this.characterService.getAllCharacters();
      this.characterList = result;
    } catch {
      throw 'Errore nel recupero dei personaggi';
    }
  }
}
