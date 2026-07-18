import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CharacterDTO } from '../models/CharacterDTO';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private baseUrl: string = 'https://thronesapi.com/api/v2/Characters';

  constructor(private http: HttpClient) {}

  getAllCharacters(): Promise<CharacterDTO[]> {
    /**
     * il metodo get di HttpClient ritorna un observable.
     * trasformiamo l'observable in promise con firstValueFrom
     */
    return firstValueFrom(this.http.get<CharacterDTO[]>(`${this.baseUrl}`));
  }

  getCharacterById(id: string): Promise<CharacterDTO> {
    /**
     * trasformiamo l'observable in promise
     */
    return firstValueFrom(this.http.get<CharacterDTO>(`${this.baseUrl}/${id}`));
  }
}
