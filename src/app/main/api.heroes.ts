import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject} from '@angular/core';
import {Observable} from 'rxjs';
import {Hero} from './interfaces/hero.interface';

const heroesUrl = 'api/heroes';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
};

export const heroesFn = (): (() => Observable<Hero[]>) => {
  const http = inject(HttpClient);

  return () => http.get<Hero[]>(heroesUrl);
}

export const heroFn = (): ((id: number) => Observable<Hero>) => {
  const http = inject(HttpClient);

  return (id: number) => http.get<Hero>(`${heroesUrl}/${id}`);
}

export const updateFn = (): ((hero: Hero) => Observable<any>) => {
  const http = inject(HttpClient);

  return (hero: Hero) => http.put(heroesUrl, hero, httpOptions);
}

/** POST: add a new hero to the server */
export const addFn = (): ((hero: Hero) => Observable<Hero>) => {
  const http = inject(HttpClient);

  return (hero: Hero) => http.post<Hero>(heroesUrl, hero, httpOptions);
}

export const deleteFn = (): ((id: number) => Observable<Hero>) => {
  const http = inject(HttpClient);

  return (id: number) => http.delete<Hero>(`${heroesUrl}/${id}`, httpOptions);
}

export const searchFn = (): ((term: string) => Observable<Hero[]>) => {
  const http = inject(HttpClient);

  return (term: string) => {
    console.log('here');
    return http.get<Hero[]>(`${heroesUrl}/?name=${term}`);
  }
}


