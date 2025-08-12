Fase 1: Configuración del Proyecto y Backend (Día 1)
Antes de crear componentes, preparamos tanto el frontend como el backend.

(Sin Cambios) 1.1 Configuración de Angular: Sigue los pasos para crear el proyecto e integrar Tailwind CSS.

1.2 (NUEVO) Configuración del Backend con Supabase:

Crear el Proyecto: Ve a supabase.com, crea una cuenta y un nuevo proyecto. Guarda tu URL del Proyecto y tu clave de API anon public. Estas son tus llaves para conectar la app.

Diseñar la Base de Datos: Dentro del "Table Editor" de Supabase, crearás las tablas que almacenarán tus datos. Este es tu esquema:

profiles: Para almacenar información de los usuarios. Columnas: id (vinculado a auth.users), email, full_name, y una columna crucial role (de tipo text) que contendrá 'dueña' o 'empleada'.

services: Para los servicios de la boutique. Columnas: id, name, description, price.

sales: Para los ingresos. Columnas: id, created_at, amount, service_id (vinculado a services.id), employee_id (vinculado a profiles.id).

expenses: Para los egresos. Columnas: id, created_at, description, amount.

Instalar el Cliente de Supabase en Angular:

Bash

npm install @supabase/supabase-js
Configurar las Variables de Entorno: Abre src/environments/environment.ts y guarda tus claves de Supabase allí. Nunca subas claves secretas a un repositorio público.

TypeScript

export const environment = {
  production: false,
  supabaseUrl: 'TU_URL_DE_PROYECTO_SUPABASE',
  supabaseKey: 'TU_CLAVE_ANON_PUBLIC'
};
Fase 2: Arquitectura y Seguridad Full-Stack (Día 1-2)
Ahora conectamos la seguridad del frontend con la del backend.

(Mejorado) 2.1 Estructura de Carpetas: La estructura se mantiene, pero ahora los servicios tendrán una dependencia clara del backend.

2.2 (NUEVO y CRÍTICO) 🛡️ Implementar la Seguridad en la Base de Datos (Row Level Security - RLS):
Este es el paso de seguridad más importante de todo el proyecto. Como tu app Angular hablará directamente con la base de datos a través de la API de Supabase, la defensa no está en un servidor intermedio, sino

directamente en la base de datos.



Para cada tabla, debes activar RLS y luego crear políticas que definan quién puede hacer qué.

Ejemplos de Políticas RLS en SQL (a ejecutar en el editor SQL de Supabase):

SQL

-- Primero, habilita RLS en cada tabla
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- POLÍTICA 1: Las empleadas solo pueden ver su propio perfil. La dueña puede ver todos.
CREATE POLICY "Users can view their own profile, owner can view all"
ON profiles FOR SELECT USING (
  auth.uid() = id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'dueña'
);

-- POLÍTICA 2: Las empleadas solo pueden registrar ventas para ellas mismas.
CREATE POLICY "Employees can create their own sales"
ON sales FOR INSERT WITH CHECK (auth.uid() = employee_id);

-- POLÍTICA 3: Las empleadas solo pueden ver sus propias ventas. La dueña puede ver todas.
CREATE POLICY "Employees can view their own sales, owner can view all"
ON sales FOR SELECT USING (
  auth.uid() = employee_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'dueña'
);

-- POLÍTICA 4: Solo la dueña puede gestionar los servicios.
CREATE POLICY "Owner can manage all services"
ON services FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'dueña'
);
2.3 (Mejorado) Conexión Centralizada en Angular:
Crea un servicio central para manejar la instancia del cliente de Supabase, asegurando que solo se inicialice una vez.

TypeScript

// src/app/core/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  public readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
  }
}
Fase 3: Desarrollo de Funcionalidades Conectadas (Días 2-5)
Ahora, los servicios que mencionamos en el plan anterior usarán el SupabaseService.

Estado Global y Autenticación:

AuthService: Este servicio inyectará SupabaseService. Sus métodos

login() y register() llamarán a supabase.auth.signInWithPassword() y supabase.auth.signUp().  Escuchará los cambios de autenticación con

supabase.auth.onAuthStateChange() para actualizar el SignalStore con la sesión del usuario.

Servicios de Datos (ServiciosService, SalesService, etc.):

Cada servicio de datos inyectará el SupabaseService para realizar operaciones CRUD.

Ejemplo en ServiciosService:

TypeScript

// ...
import { SupabaseService } from 'src/app/core/supabase.service';

@Injectable({ providedIn: 'root' })
export class ServiciosService {
  private supabase = inject(SupabaseService).client;

  async getServices() {
    const { data, error } = await this.supabase.from('services').select('*');
    if (error) throw error;
    return data || [];
  }
  // ... métodos para addService, updateService, etc.
}
(Sin Cambios en la lógica del componente) El desarrollo de los componentes del Panel de Administración y Registro de Ventas sigue igual, pero ahora sus servicios de dependencia están completamente conectados a Supabase, y la seguridad está garantizada por las políticas de RLS que has creado.
