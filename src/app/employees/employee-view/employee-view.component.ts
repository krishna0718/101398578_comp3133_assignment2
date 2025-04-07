import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployeeById($id: ID!) {
    getEmployeeById(id: $id) {
      id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
    }
  }
`;

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="view-container">
  <h2>Employee Details</h2>
  <div class="info-card">
    <div class="info-row"><strong>First Name:</strong> {{ employee.first_name }}</div>
    <div class="info-row"><strong>Last Name:</strong> {{ employee.last_name }}</div>
    <div class="info-row"><strong>Email:</strong> {{ employee.email }}</div>
    <div class="info-row"><strong>Gender:</strong> {{ employee.gender }}</div>
    <div class="info-row"><strong>Designation:</strong> {{ employee.designation }}</div>
    <div class="info-row"><strong>Salary:</strong> {{ employee.salary | currency }}</div>
    <div class="info-row"><strong>Department:</strong> {{ employee.department }}</div>
    <div class="info-row"><strong>Joining Date:</strong> {{ employee.date_of_joining | date }}</div>
  </div>
</div>

  `,
  styles: [`.view-container {
    max-width: 600px;
    margin: 5rem auto;
    padding: 2rem;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    color: #333;
  }
  
  .info-card {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    background: #f9f9fb;
    padding: 1.5rem;
    border-radius: 10px;
    font-size: 1rem;
  }
  
  .info-row {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #ddd;
  
    &:last-child {
      border-bottom: none;
    }
  
    strong {
      color: #555;
      width: 150px;
      display: inline-block;
    }
  }
  `]
})
export class ViewEmployeeComponent implements OnInit {
  employee: any;

  constructor(private route: ActivatedRoute, private apollo: Apollo) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.apollo
      .watchQuery({ query: GET_EMPLOYEE_BY_ID, variables: { id } })
      .valueChanges.pipe(map((res: any) => res.data.getEmployeeById))
      .subscribe((emp) => (this.employee = emp));
  }
}
