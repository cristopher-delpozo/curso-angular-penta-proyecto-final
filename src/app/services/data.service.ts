import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, of } from 'rxjs';
import { ICharactersPage } from '../interfaces/ICharactersPage';
import { ICharacter } from '../interfaces/ICharacter';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getCharactersByPage(page: number): Observable<ICharactersPage> {
    return this.http.get<ICharactersPage>(
      `https://rickandmortyapi.com/api/character/?page=${page}`
    );
  }

  getCharacterById(idCharacter: number): Observable<ICharacter> {
    return this.http.get<ICharacter>(
      `https://rickandmortyapi.com/api/character/${idCharacter}`
    );
  }

  async getAllCharacters(numPages: number): Promise<ICharacter[]> {
    let characters: ICharacter[] = [];
    let result: Observable<ICharactersPage>;
    let lastValue: ICharactersPage;

    console.log('Antes del for');

    for (let i = 1; i <= numPages; i++) {
      result = this.http.get<ICharactersPage>(
        `https://rickandmortyapi.com/api/character/?page=${i}`
      );
      lastValue = await lastValueFrom(result)      
      characters = characters.concat(lastValue.results)
    }

    console.log(characters)

    console.log('Despues del for');

    return characters;
  }
}
