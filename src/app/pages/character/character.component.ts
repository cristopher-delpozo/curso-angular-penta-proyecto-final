import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ICharacter } from 'src/app/interfaces/ICharacter';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})
export class CharacterComponent implements OnInit {
  errorMessage: string = '';
  character!: ICharacter;

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCharacter();
  }

  getCharacter() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.dataService
        .getCharacterById(id)
        .pipe(
          catchError((err) => {
            const { message } = err;
            this.errorMessage = message;
            return throwError(() => new Error(message));
          })
        )
        .subscribe((data) => (this.character = data));
    });
  }
}
