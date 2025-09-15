// src/app/core/services/sync.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IndexedDbService } from './indexed-db.service';
import { catchError, switchMap, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private isOnline = navigator.onLine;

  constructor(
    private http: HttpClient,
    private indexedDb: IndexedDbService
  ) {
    // Escuchar eventos de conexión
    window.addEventListener('online', () => this.handleOnlineStatus());
    window.addEventListener('offline', () => this.handleOfflineStatus());
  }

  private handleOnlineStatus(): void {
    this.isOnline = true;
    this.syncData();
  }

  private handleOfflineStatus(): void {
    this.isOnline = false;
  }

  // Sincronizar datos cuando se recupera la conexión
  async syncData(): Promise<void> {
    try {
      // Sincronizar reservas pendientes
      const pendingRentals = await this.indexedDb.getRentals();
      for (const rental of pendingRentals) {
        // Verificar si necesita sincronización
        if (!rental.id || await this.needsSync(rental.id)) {
          await this.syncRental(rental);
        }
      }
    } catch (error) {
      console.error('Error sincronizando datos:', error);
    }
  }

  private async syncRental(rental: any): Promise<void> {
    if (!this.isOnline) return;

    try {
      // Intentar enviar al backend
      const response = await this.http.post('/api/rentals', rental).toPromise();
      
      // Si es exitoso, marcar como sincronizado
      if (rental.id) {
        await this.indexedDb.updateRental(rental.id, { status: 'active' });
      }
    } catch (error) {
      console.error('Error sincronizando reserva:', error);
    }
  }

  private async needsSync(rentalId: number): Promise<boolean> {
    // Lógica para determinar si necesita sincronización
    // Por ejemplo, verificar si ya existe en el backend
    try {
      await this.http.get(`/api/rentals/${rentalId}`).toPromise();
      return false; // Ya existe en el backend
    } catch (error) {
      return true; // No existe, necesita sincronización
    }
  }

  // Verificar estado de conexión
  isConnected(): boolean {
    return this.isOnline;
  }

  // Obtener datos con estrategia offline-first
  getVehicleTypes() {
    if (this.isOnline) {
      return this.http.get('/api/vehicle-types').pipe(
        switchMap(async (types: any) => {
          // Guardar en IndexedDB para uso offline
          for (const type of types) {
            await this.indexedDb.addVehicleType(type);
          }
          return types;
        }),
        catchError(() => {
          // Si falla, usar datos locales
          return from(this.indexedDb.getVehicleTypes());
        })
      );
    } else {
      // Usar datos offline
      return from(this.indexedDb.getVehicleTypes());
    }
  }

  // Similar para otros métodos de obtención de datos
}
