import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";

import {Hero, Publisher} from "../../interfaces/hero";
import {HeroesService} from "../../services/hero.service";
import {filter, switchMap} from "rxjs";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'heroes-new-page',
  templateUrl: './new-page.component.html',
  styles: []
})

export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', {nonNullable: true}),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl('')
  })

  public publishers = [
    {id: 'DC Comics', description: 'DC - Comics'},
    {id: 'Marvel Comics', description: 'Marvel - Comics'},
  ]

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {

    if (!this.router.url.includes('edit')) return

    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroById(id)),
      ).subscribe((hero) => {
      if (!hero) return this.router.navigateByUrl('/')
      return this.heroForm.reset(hero)
    })

  }

  get currentHero(): Hero {
    return this.heroForm.value as Hero
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe((hero) => {
          // TODO: show snackbar
          this.showSnackbar(`${hero.superhero} updated`)
        })
      return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe((hero) => {
        this.router.navigate(['/heroes/edit', hero.id])
        this.showSnackbar(`${hero.superhero} created`)
        // TODO: show snackbar and navigate to heroes/edit/id
      })

  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500
    })
  }

  onDeleteHero(): void {
    if (!this.currentHero.id) throw Error('Hero id is required')

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    })

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() =>  this.heroesService.deleteHero(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted),
      )
      .subscribe(result => {
        console.log(result)
        this.router.navigate(['/heroes'])
      })

  }

}
