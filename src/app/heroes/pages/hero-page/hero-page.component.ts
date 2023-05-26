import {Component, OnInit} from '@angular/core';
import {HeroesService} from "../../services/hero.service";
import {ActivatedRoute, Router} from "@angular/router";
import {delay, switchMap} from "rxjs";
import {Hero} from "../../interfaces/hero";

@Component({
  selector: 'heroes-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [
  ]
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  constructor(
    private heroesService: HeroesService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.activateRoute.params
      .pipe(
        delay(250),
        switchMap(({id}) => this.heroesService.getHeroById(id))
      )
      .subscribe((hero ): void => {

        if (!hero) {
          this.router.navigate(['/heroes/list'])
            .catch(e => console.log(e))
          return
        }

        this.hero = hero
        return

      })
  }

  goBack():void {
    this.router.navigateByUrl('heroes/list')
  }

}
