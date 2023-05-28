import { Component } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Hero} from "../../interfaces/hero";
import {HeroesService} from "../../services/hero.service";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
  selector: 'heroes-search-page',
  templateUrl: './search-page.component.html',
  styles: [
  ]
})

export class SearchPageComponent {

  public searchInput = new FormControl('')
  public heroes: Hero[] = []
  public selectedHero?: Hero

  constructor(private heroService: HeroesService) {
  }

  searchHero() {
    const value:string = this.searchInput.value || ''
    this.heroService.getSuggestions(value)
      .subscribe(heroes => this.heroes = heroes)
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent) {
    console.log({event})

    if (!event.option.value) {
      this.selectedHero = undefined
      return
    }

    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);
    this.selectedHero = hero;

  }

}
