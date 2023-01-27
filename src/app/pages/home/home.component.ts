import { Component, OnInit } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ICharacter } from 'src/app/interfaces/ICharacter';
import { ICharactersPage } from 'src/app/interfaces/ICharactersPage';
import { DataService } from 'src/app/services/data.service';
import { SendMessageService } from 'src/app/services/send-message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  errorMessage: string = '';
  alertClasses: string = '';
  charactersPage!: ICharactersPage;
  page: number = 1;
  pageSize: number = 20;
  numPages: number = 0;

  private allCharacters: ICharacter[] = [];
  searchString: string = '';

  constructor(
    private dataService: DataService,
    private sendMessageService: SendMessageService
  ) {}

  ngOnInit(): void {
    this.getCharactersPage();
    this.sendMessageService.messageEmitter.subscribe((data) => {
      this.searchString = data;
      this.searchCharacter();
    });
  }

  async getCharactersPage() {
    if (this.allCharacters.length === 0) {
      this.allCharacters = await this.dataService.getAllCharacters(
        this.numPages
      );
    }
    
    if (this.searchString.length == 0) {
      this.dataService
        .getCharactersByPage(this.page)
        .pipe(
          catchError((err) => {
            this.errorMessage = err.message ?? 'Error desconocido';
            this.alertClasses = 'alert alert-danger';
            return throwError(() => new Error(this.errorMessage));
          })
        )
        .subscribe((data) => {
          this.charactersPage = data;
          this.numPages = data.info.pages;
        });
    }
  }

  async searchCharacter() {
    this.errorMessage = '';

    if (this.searchString.length > 0) {
      this.charactersPage.results = this.allCharacters.filter((char) =>
        char.name.toLowerCase().includes(this.searchString.toLowerCase())
      );

      const resultsCount = this.charactersPage.results.length;

      if (resultsCount === 0) {
        this.errorMessage = 'No results found';
        this.alertClasses = 'alert alert-warning';
      } else {
        this.charactersPage.info.count = resultsCount
      }
    } else {
      this.getCharactersPage();
    }
  }

  async roundTo(value: number, places: number) {
    const power = Math.pow(10, places);
    return Math.round((value + Number.EPSILON) * power) / power;
  }
}
