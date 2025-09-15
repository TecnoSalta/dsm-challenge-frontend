// src/app/core/services/indexed-db.service.ts
import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Definir el esquema de la base de datos
interface CarRentalDB extends DBSchema {
  'vehicle-types': {
    key: number;
    value: {
      id: number;
      name: string;
      description: string;
    };
    indexes: { 'by-name': string };
  };
  'vehicle-models': {
    key: number;
    value: {
      id: number;
      name: string;
      typeId: number;
      brand: string;
      year?: number;
      dailyRate?: number;
    };
    indexes: { 'by-type': number; 'by-brand': string };
  };
  'rentals': {
    key: number;
    value: {
      id: number;
      customerId: string;
      customerName: string;
      customerAddress: string;
      carModelId: number;
      startDate: Date;
      endDate: Date;
      status: 'active' | 'cancelled' | 'completed';
      createdAt: Date;
    };
    indexes: { 'by-customer': string; 'by-date': Date; 'by-status': string };
  };
  'customers': {
    key: string;
    value: {
      id: string;
      fullName: string;
      address: string;
      email?: string;
      phone?: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbPromise: Promise<IDBPDatabase<CarRentalDB>>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase<CarRentalDB>> {
    return openDB<CarRentalDB>('car-rental-db', 1, {
      upgrade(db) {
        // Crear object store para tipos de vehículo
        const vehicleTypeStore = db.createObjectStore('vehicle-types', {
          keyPath: 'id',
          autoIncrement: true
        });
        vehicleTypeStore.createIndex('by-name', 'name');

        // Crear object store para modelos de vehículo
        const vehicleModelStore = db.createObjectStore('vehicle-models', {
          keyPath: 'id',
          autoIncrement: true
        });
        vehicleModelStore.createIndex('by-type', 'typeId');
        vehicleModelStore.createIndex('by-brand', 'brand');

        // Crear object store para reservas
        const rentalStore = db.createObjectStore('rentals', {
          keyPath: 'id',
          autoIncrement: true
        });
        rentalStore.createIndex('by-customer', 'customerId');
        rentalStore.createIndex('by-date', 'startDate');
        rentalStore.createIndex('by-status', 'status');

        // Crear object store para clientes
        db.createObjectStore('customers', {
          keyPath: 'id'
        });
      },
    });
  }

  // Métodos para tipos de vehículo
  async addVehicleType(vehicleType: Omit<CarRentalDB['vehicle-types']['value'], 'id'>): Promise<number> {
    const db = await this.dbPromise;
    return db.add('vehicle-types', vehicleType as any);
  }

  async getVehicleTypes(): Promise<CarRentalDB['vehicle-types']['value'][]> {
    const db = await this.dbPromise;
    return db.getAll('vehicle-types');
  }

  async getVehicleType(id: number): Promise<CarRentalDB['vehicle-types']['value'] | undefined> {
    const db = await this.dbPromise;
    return db.get('vehicle-types', id);
  }

  // Métodos para modelos de vehículo
  async addVehicleModel(vehicleModel: Omit<CarRentalDB['vehicle-models']['value'], 'id'>): Promise<number> {
    const db = await this.dbPromise;
    return db.add('vehicle-models', vehicleModel as any);
  }

  async getVehicleModels(): Promise<CarRentalDB['vehicle-models']['value'][]> {
    const db = await this.dbPromise;
    return db.getAll('vehicle-models');
  }

  async getVehicleModelsByType(typeId: number): Promise<CarRentalDB['vehicle-models']['value'][]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('vehicle-models', 'by-type', typeId);
  }

  // Métodos para reservas
  async addRental(rental: Omit<CarRentalDB['rentals']['value'], 'id'>): Promise<number> {
    const db = await this.dbPromise;
    return db.add('rentals', { ...rental, createdAt: new Date() } as any);
  }

  async getRentals(): Promise<CarRentalDB['rentals']['value'][]> {
    const db = await this.dbPromise;
    return db.getAll('rentals');
  }

  async getRental(id: number): Promise<CarRentalDB['rentals']['value'] | undefined> {
    const db = await this.dbPromise;
    return db.get('rentals', id);
  }

  async updateRental(id: number, updates: Partial<CarRentalDB['rentals']['value']>): Promise<void> {
    const db = await this.dbPromise;
    const rental = await db.get('rentals', id);
    if (rental) {
      await db.put('rentals', { ...rental, ...updates });
    }
  }

  async cancelRental(id: number): Promise<void> {
    await this.updateRental(id, { status: 'cancelled' });
  }

  // Métodos para clientes
  async addCustomer(customer: CarRentalDB['customers']['value']): Promise<string> {
    const db = await this.dbPromise;
    return db.add('customers', customer);
  }

  async getCustomer(id: string): Promise<CarRentalDB['customers']['value'] | undefined> {
    const db = await this.dbPromise;
    return db.get('customers', id);
  }

  // Método para poblar datos iniciales
  async seedInitialData(): Promise<void> {
    const db = await this.dbPromise;
    
    // Verificar si ya existen datos
    const existingTypes = await db.count('vehicle-types');
    if (existingTypes === 0) {
      // Agregar tipos de vehículo
      await this.addVehicleType({ name: 'Sedán', description: 'Automóvil de turismo' });
      await this.addVehicleType({ name: 'SUV', description: 'Vehículo utilitario deportivo' });
      await this.addVehicleType({ name: 'Pickup', description: 'Camioneta de carga' });
      await this.addVehicleType({ name: 'Compacto', description: 'Vehículo pequeño' });

      // Agregar modelos de vehículo
      await this.addVehicleModel({ name: 'Toyota Corolla', typeId: 1, brand: 'Toyota', dailyRate: 45 });
      await this.addVehicleModel({ name: 'Honda Civic', typeId: 1, brand: 'Honda', dailyRate: 42 });
      await this.addVehicleModel({ name: 'Ford Explorer', typeId: 2, brand: 'Ford', dailyRate: 65 });
      await this.addVehicleModel({ name: 'Jeep Cherokee', typeId: 2, brand: 'Jeep', dailyRate: 70 });
      await this.addVehicleModel({ name: 'Chevrolet Silverado', typeId: 3, brand: 'Chevrolet', dailyRate: 85 });
      await this.addVehicleModel({ name: 'Toyota Hilux', typeId: 3, brand: 'Toyota', dailyRate: 80 });
      await this.addVehicleModel({ name: 'Nissan Versa', typeId: 4, brand: 'Nissan', dailyRate: 35 });
      await this.addVehicleModel({ name: 'Kia Rio', typeId: 4, brand: 'Kia', dailyRate: 38 });
    }
  }

  // Método para limpiar la base de datos (solo desarrollo)
  async clearDatabase(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('vehicle-types');
    await db.clear('vehicle-models');
    await db.clear('rentals');
    await db.clear('customers');
  }
}