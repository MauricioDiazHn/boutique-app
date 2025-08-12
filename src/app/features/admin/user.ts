import { Injectable, signal, computed } from '@angular/core';

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: 'empleada'; // Admin can only manage employees
  isActive: boolean;
}

const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, name: 'Laura', email: 'laura@boutique.com', role: 'empleada', isActive: true },
  { id: 2, name: 'Sofia', email: 'sofia@boutique.com', role: 'empleada', isActive: true },
  { id: 3, name: 'Carla', email: 'carla@boutique.com', role: 'empleada', isActive: false },
];

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private employeesState = signal<Employee[]>(MOCK_EMPLOYEES);

  public employees = computed(() => this.employeesState());

  addUser(employeeData: Omit<Employee, 'id' | 'isActive' | 'role'>): void {
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now(), // simple unique id
      role: 'empleada',
      isActive: true,
    };
    this.employeesState.update(employees => [...employees, newEmployee]);
  }

  updateUser(updatedEmployee: Employee): void {
    this.employeesState.update(employees =>
      employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
  }

  // Soft delete
  deactivateUser(id: number): void {
    this.employeesState.update(employees =>
      employees.map(emp => emp.id === id ? { ...emp, isActive: false } : emp)
    );
  }

  // Optional: a method to reactivate a user
  reactivateUser(id: number): void {
    this.employeesState.update(employees =>
      employees.map(emp => emp.id === id ? { ...emp, isActive: true } : emp)
    );
  }
}
