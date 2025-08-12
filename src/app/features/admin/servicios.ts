import { Injectable, signal, computed } from '@angular/core';

export interface BoutiqueService {
  id: number;
  name: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
}

const MOCK_SERVICES: BoutiqueService[] = [
  { id: 1, name: 'Corte de Dama', price: 250, duration: 45, isActive: true },
  { id: 2, name: 'Tinte Completo', price: 800, duration: 120, isActive: true },
  { id: 3, name: 'Manicura', price: 150, duration: 30, isActive: true },
  { id: 4, name: 'Pedicura', price: 200, duration: 40, isActive: false },
];

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private servicesState = signal<BoutiqueService[]>(MOCK_SERVICES);

  public services = computed(() => this.servicesState());
  public activeServices = computed(() => this.servicesState().filter(s => s.isActive));


  addService(serviceData: Omit<BoutiqueService, 'id' | 'isActive'>): void {
    const newService: BoutiqueService = {
      ...serviceData,
      id: Date.now(),
      isActive: true,
    };
    this.servicesState.update(services => [...services, newService]);
  }

  updateService(updatedService: BoutiqueService): void {
    this.servicesState.update(services =>
      services.map(s => s.id === updatedService.id ? updatedService : s)
    );
  }

  deactivateService(id: number): void {
    this.servicesState.update(services =>
      services.map(s => s.id === id ? { ...s, isActive: false } : s)
    );
  }

  reactivateService(id: number): void {
    this.servicesState.update(services =>
      services.map(s => s.id === id ? { ...s, isActive: true } : s)
    );
  }
}
