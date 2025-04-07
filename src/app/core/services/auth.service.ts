import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private apollo: Apollo) {}

  login(email: string, password: string) {
    return this.apollo.query({
      query: gql`
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
          }
        }
      `,
      variables: { email, password },
      fetchPolicy: 'no-cache'
    }).pipe(map((result: any) => result.data.login));
  }

  signup(email: string, password: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation Signup($email: String!, $password: String!) {
          signup(email: $email, password: $password) {
            _id
          }
        }
      `,
      variables: { email, password }
    }).pipe(map((res: any) => res.data.signup));
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
