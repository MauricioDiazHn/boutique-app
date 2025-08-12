import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from 'src/app/core/state/app.store';
import { UserService } from '../admin/user';
import { ServiciosService } from '../admin/servicios';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  public appStore = inject(AppStore);
  private userService = inject(UserService);
  private serviciosService = inject(ServiciosService);

  public employeeCount = signal(0);
  public serviceCount = signal(0);

  async ngOnInit() {
    const employees = await this.userService.getEmployees();
    this.employeeCount.set(employees.length);

    const services = await this.serviciosService.getServices();
    this.serviceCount.set(services.length);
  }
}
