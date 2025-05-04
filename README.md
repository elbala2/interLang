# InterLang

Una biblioteca TypeScript/JavaScript sin dependencias para trabajar con múltiples idiomas en tus aplicaciones.

## Instalación

```bash
npm install interlang
```

## Uso

### TypeScript

```typescript
import InterLang from 'interlang';

// Crear una instancia con opciones
const interlang = new InterLang({ 
  debug: true 
});

// Inicializar
interlang.initialize();

// Usar métodos
const result = interlang.process('Hola mundo');
console.log(result);
```

### JavaScript

```javascript
const { InterLang } = require('interlang');

// Crear una instancia
const interlang = new InterLang();

// Usar métodos
console.log(interlang.process('Hello world'));
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Modo desarrollo (compilación en tiempo real)
npm run dev
```

## Licencia

MIT