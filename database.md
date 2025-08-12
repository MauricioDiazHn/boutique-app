# Documentación de la Base de Datos (Supabase)

Este documento describe la estructura de la base de datos, las políticas de seguridad a nivel de fila (RLS) y los triggers configurados en el proyecto de Supabase.

## Esquema de Tablas

### 1. `profiles`
Almacena información del usuario, extendiendo la tabla `auth.users` de Supabase.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Llave primaria, referencia a `auth.users.id`. |
| `email` | `TEXT` | Email del usuario. |
| `full_name` | `TEXT` | Nombre completo del usuario. |
| `role` | `TEXT` | Rol del usuario. Debe ser `'dueña'` o `'empleada'`. |
| `created_at` | `TIMESTAMPTZ` | Fecha de creación del perfil. |
| `updated_at` | `TIMESTAMPTZ` | Última fecha de actualización del perfil. |

### 2. `services`
Almacena los servicios ofrecidos por la boutique.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `SERIAL` | Llave primaria autoincremental. |
| `name` | `TEXT` | Nombre del servicio. |
| `description` | `TEXT` | Descripción del servicio. |
| `price` | `DECIMAL(10,2)` | Precio del servicio. |
| `created_at` | `TIMESTAMPTZ` | Fecha de creación del servicio. |
| `updated_at` | `TIMESTAMPTZ` | Última fecha de actualización del servicio. |

### 3. `sales`
Registra las ventas realizadas.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `SERIAL` | Llave primaria autoincremental. |
| `created_at` | `TIMESTAMPTZ` | Fecha de la venta. |
| `amount` | `DECIMAL(10,2)` | Monto total de la venta. |
| `client_name` | `TEXT` | Nombre del cliente. |
| `service_id` | `INTEGER` | Referencia a `services.id`. |
| `employee_id` | `UUID` | Referencia a `profiles.id` (quién realizó la venta). |

### 4. `expenses`
Registra los gastos del negocio.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `SERIAL` | Llave primaria autoincremental. |
| `created_at` | `TIMESTAMPTZ` | Fecha del gasto. |
| `description` | `TEXT` | Descripción del gasto. |
| `amount` | `DECIMAL(10,2)` | Monto del gasto. |
| `created_by`| `UUID` | Referencia a `profiles.id` (quién registró el gasto). |

---

## Políticas de Seguridad (Row Level Security - RLS)

Todas las tablas tienen RLS activado.

### `profiles`
- **SELECT:** Los usuarios pueden ver su propio perfil. La 'dueña' puede ver todos los perfiles.
- **UPDATE:** Los usuarios pueden actualizar su propio perfil (pero no su rol). Solo la 'dueña' puede modificar el rol de otros usuarios.

### `services`
- **SELECT:** Cualquiera puede ver la lista de servicios.
- **ALL (INSERT, UPDATE, DELETE):** Solo la 'dueña' puede gestionar los servicios.

### `sales`
- **SELECT:** Las 'empleadas' pueden ver sus propias ventas. La 'dueña' puede ver todas las ventas.
- **INSERT:** Las 'empleadas' solo pueden registrar ventas para sí mismas (`employee_id` debe ser su propio `id`).
- **UPDATE / DELETE:** Solo la 'dueña' puede modificar o eliminar registros de ventas.

### `expenses`
- **ALL (INSERT, UPDATE, DELETE):** Solo la 'dueña' puede gestionar los gastos.

---

## Triggers y Funciones

### `update_updated_at_column()`
- **Disparador:** `BEFORE UPDATE` en `profiles` y `services`.
- **Acción:** Actualiza automáticamente el campo `updated_at` a la fecha y hora actual cada vez que se modifica una fila.

### `handle_new_user()`
- **Disparador:** `AFTER INSERT` en `auth.users`.
- **Acción:** Crea automáticamente un registro correspondiente en la tabla `profiles` para cada nuevo usuario que se registra.
- **Importante:** El rol por defecto para cada nuevo usuario se establece en `'empleada'`. Para asignar el rol de `'dueña'`, se debe hacer una modificación manual directamente en la base de datos.
