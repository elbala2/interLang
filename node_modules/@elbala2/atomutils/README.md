# AtomUtils

Colección de utilidades diversas en TypeScript para manipulación de objetos y más.

## Instalación

```bash
npm install atomutils
# o
yarn add atomutils
# o
pnpm add atomutils
```

## Uso

```typescript
import { Object } from 'atomutils';

// Manipulación de objetos
const obj = {
  user: {
    name: 'Juan',
    address: {
      city: 'Madrid'
    }
  }
};

// Obtener valores anidados de forma segura
const city = Object.get(obj, 'user.address.city'); // 'Madrid'
const country = Object.get(obj, 'user.address.country'); // undefined

// Establecer valores anidados
Object.set(obj, 'user.address.country', 'España');

// Eliminar propiedades
Object.del(obj, 'user.address.city');

// Comparar objetos
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const areEqual = Object.isEquals(obj1, obj2); // true
```

## API

### Object

#### `get(obj: Object, path: string): any`
Obtiene un valor de un objeto a partir de una ruta usando notación de punto.

#### `set(obj: Object, path: string, value: any): Record<string, any>`
Establece un valor en un objeto a partir de una ruta usando notación de punto.

#### `del(obj: Object, path: string): Record<string, any>`
Elimina una propiedad de un objeto a partir de una ruta usando notación de punto.

#### `isEquals(obj1: any, obj2: any): boolean`
Compara dos valores u objetos en profundidad para determinar si son iguales.

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request.

## Licencia

MIT 