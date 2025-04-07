import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees() {
    return this.apollo.watchQuery({
      query: gql`
        query GetAll {
          employees {
            _id
            firstName
            lastName
            email
            department
            position
            profilePic
          }
        }
      `
    }).valueChanges.pipe(map((result: any) => result.data.employees));
  }

  getEmployeeById(id: string) {
    return this.apollo.query({
      query: gql`
        query GetEmployee($id: ID!) {
          employee(id: $id) {
            _id
            firstName
            lastName
            email
            department
            position
            profilePic
          }
        }
      `,
      variables: { id }
    }).pipe(map((result: any) => result.data.employee));
  }

  addEmployee(employee: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation Add($input: EmployeeInput!) {
          addEmployee(input: $input) {
            _id
          }
        }
      `,
      variables: { input: employee }
    });
  }

  updateEmployee(id: string, employee: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation Update($id: ID!, $input: EmployeeInput!) {
          updateEmployee(id: $id, input: $input) {
            _id
          }
        }
      `,
      variables: { id, input: employee }
    });
  }

  deleteEmployee(id: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation Delete($id: ID!) {
          deleteEmployee(id: $id) {
            _id
          }
        }
      `,
      variables: { id }
    });
  }
}
