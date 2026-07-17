import { Routes } from '@angular/router';
import { CharacterList } from './components/character-list/character-list';
import { CharacterDetails } from './components/character-details/character-details';

export const routes: Routes = [
  { path: '', component: CharacterList },
  { path: 'characters/:id', component: CharacterDetails },
  { path: '**', redirectTo: '' },
];
