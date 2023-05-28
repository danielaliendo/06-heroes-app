import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { User } from "../interfaces/user.interface";
import {catchError, map, Observable, of, tap} from "rxjs";

@Injectable({providedIn: 'root'})

export class AuthService {

  private baseUrl: string = environment.baseUrl
  private user?: User

  constructor(private http: HttpClient) {
  }

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    return {...this.user}
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        tap(user => localStorage.setItem('token', JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhbmllbGFsaWVuZG85OEBnbWFpbC5jb20iLCJ1c2VyIjoiRGFuaWVsYSBMaWVuZG8iLCJpZCI6MX0.JSzKXlXAPo1vNiM6qwttXV6STrcDDTIHK5mn9GqUbRM')))
      )
  }

  checkAuthentication(): Observable<boolean> {

    const token: string | null = JSON.parse(localStorage.getItem('token') || 'null')

    if (!token) return of(false)

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        map( user => !!user),
        catchError(() => of(false))
      )

  }

  logout() {
    this.user = undefined
    localStorage.clear()
  }

}
