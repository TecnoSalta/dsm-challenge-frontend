// src/app/core/services/vehicle-catalog.service.ts
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IndexedDbService } from './indexed-db.service';
import { SyncService } from './sync.service';

export interface VehicleType {
  id: number;
  name: string;
  description?: string;
}

export interface VehicleModel {
  id: number;
  name: string;
  typeId: number;
  brand: string;
  year?: number;
  dailyRate?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleCatalogService {
  constructor(
    private indexedDb: IndexedDbService,
    private syncService: SyncService
  ) {}

  getVehicleTypes(): Observable<VehicleType[]> {
    return this.syncService.getVehicleTypes().pipe(
      catchError(() => from(this.indexedDb.getVehicleTypes()))
    );
  }

  getVehicleModels(): Observable<VehicleModel[]> {
    if (this.syncService.isConnected()) {
      // Intentar obtener del backend primero
      // (implementar similar a getVehicleTypes)
      return from(this.indexedDb.getVehicleModels());
    } else {
      return from(this.indexedDb.getVehicleModels());
    }
  }

  getModelsByType(typeId: number): Observable<VehicleModel[]> {
    return from(this.indexedDb.getVehicleModelsByType(typeId));
  }

  // Inicializar con datos de ejemplo si no hay conexión
  async initializeWithSampleData(): Promise<void> {
    const types = await this.indexedDb.getVehicleTypes();
    if (types.length === 0) {
      await this.indexedDb.seedInitialData();
    }
  }
}
