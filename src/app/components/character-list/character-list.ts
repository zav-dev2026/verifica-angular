import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../services/character-service';
import { CharacterDTO } from '../../models/CharacterDTO';
import { Character } from '../character/character';

/**
 * Una volta ricevuto la lista dei personaggi dall'api
 * nel template ciclo, e passo al componente character
 * uno dei personaggi, ed è il componente figlio che
 * ne gestisce il suo template (immagine + nome con link a dettaglio)
 */
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
  /** Lista di personaggi */
  public characterList: CharacterDTO[] = [];

  /** inietto il servizio */
  constructor(private characterService: CharacterService) {}

  /** effettuo la chiamata API durante l'inizializzione
   *  del componente in un blocco try catch
   */
  async ngOnInit(): Promise<void> {
    try {
      /**
       * Risolvo la promise tornata dal servizio e ne estraggo il risultato
       * con await e lo assegno alla proprietà della classe, oppure con la sintassi
       * .then((result) => this.characterList = result)
       */
      const result = await this.characterService.getAllCharacters();
      this.characterList = result;
    } catch {
      throw 'Errore nel recupero dei personaggi';
    }
  }
}
