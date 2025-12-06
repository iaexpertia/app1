# Guía de Diseño Responsive

Este documento describe todas las mejoras de responsive implementadas en la aplicación CyclePeaks para asegurar una experiencia óptima en móviles, tablets y escritorio.

## Breakpoints Utilizados

La aplicación utiliza los breakpoints estándar de Tailwind CSS:
- **sm**: 640px (móviles en horizontal y tablets pequeñas)
- **md**: 768px (tablets)
- **lg**: 1024px (escritorio)
- **xl**: 1280px (escritorio grande)

## Mejoras por Componente

### Header (Navegación)
**Problema**: El menú móvil no era scrolleable y se cortaba con muchos elementos.

**Solución**:
- Menú móvil tipo overlay con fondo semi-transparente
- Scrolleable verticalmente con padding inferior para evitar superposición
- Cierre automático al seleccionar una opción
- Tamaños de logo e iconos responsivos: `w-[80px] sm:w-[100px]`
- Título responsive: `text-xl sm:text-2xl`

### PassCard (Tarjetas de Puertos)
**Mejoras**:
- Altura de imagen adaptable: `h-40 sm:h-48`
- Padding responsive: `p-4 sm:p-6`
- Títulos escalables: `text-lg sm:text-xl`
- Botones con espaciado adaptable: `px-2 sm:px-3` y `space-x-1 sm:space-x-2`
- Tamaño de texto de botones: `text-xs sm:text-sm`

### PassesList (Lista de Puertos)
**Mejoras**:
- Grid responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Gap adaptable: `gap-4 sm:gap-6`
- Filtros en grid para móvil: `grid-cols-1 sm:grid-cols-2`
- Búsqueda con padding responsive

### PassModal (Modal de Detalles)
**Mejoras**:
- Padding del overlay: `p-2 sm:p-4`
- Click en overlay para cerrar + `stopPropagation` en contenido
- Altura de imagen: `h-48 sm:h-64`
- Padding interno: `p-4 sm:p-6`
- Grid de stats: `grid-cols-1 sm:grid-cols-2`
- Botones de mapas: Grid `grid-cols-1 sm:grid-cols-2`
- Texto de botones simplificado en móvil: "Google Maps" vs "Ver en Google Maps"

### AccessibilityButton (Botón de Accesibilidad)
**Mejoras**:
- Tamaño responsive: `w-12 h-12 sm:w-14 sm:h-14`
- Posición ajustada: `right-3 sm:right-4` y `bottom-24 sm:bottom-20`
- Border radius adaptable: `rounded-xl sm:rounded-2xl`

### AccessibilityPanel (Panel de Accesibilidad)
**Mejoras**:
- Ancho responsivo: `w-[calc(100vw-1rem)] sm:w-80`
- Posición adaptable: `right-2 sm:right-4` y `top-16 sm:top-20`
- Altura máxima ajustable: `max-h-[85vh] sm:max-h-[80vh]`
- Border radius: `rounded-xl sm:rounded-2xl`

### Footer
**Estado**: Ya era responsive con:
- Grid: `grid-cols-1 md:grid-cols-3`
- Flexbox adaptable: `flex-col md:flex-row`

### Main Container
**Mejoras**:
- Padding horizontal responsive: `px-2 sm:px-4 lg:px-8`

## Estilos CSS Globales

### Media Queries Personalizadas

```css
@media (max-width: 640px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }

  table {
    font-size: 0.875rem;
  }

  th, td {
    padding: 0.5rem !important;
  }
}

@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
```

## Sistema de Accesibilidad Responsive

El sistema de accesibilidad está completamente integrado con el diseño responsive:

- Tamaños de fuente se aplican con `rem` que escalan proporcionalmente
- Filtros de contraste y color funcionan en todos los tamaños de pantalla
- Modo nocturno no afecta al layout responsive
- Reducción de animaciones funciona en todos los dispositivos

## Mejores Prácticas Aplicadas

1. **Mobile First**: Estilos base para móvil, luego progresión a pantallas más grandes
2. **Touch Targets**: Todos los botones tienen mínimo 44x44px (recomendación WCAG)
3. **Legibilidad**: Tamaños de fuente escalables y suficiente contraste
4. **Espaciado**: Padding y margins adaptables para evitar contenido apretado
5. **Scrolling**: Elementos largos son scrolleables con `-webkit-overflow-scrolling: touch`
6. **Imágenes**: Altura adaptable sin afectar aspect ratio

## Testing Responsive

Para probar el diseño responsive:

1. **Chrome DevTools**:
   - F12 → Toggle device toolbar (Ctrl+Shift+M)
   - Probar con: iPhone SE, iPhone 12 Pro, iPad Air, Desktop HD

2. **Breakpoints Clave a Probar**:
   - 375px (iPhone SE - móvil pequeño)
   - 640px (móvil horizontal)
   - 768px (tablet vertical)
   - 1024px (tablet horizontal / laptop pequeño)
   - 1280px+ (escritorio)

3. **Escenarios de Prueba**:
   - Navegación con menú hamburguesa
   - Búsqueda y filtros de puertos
   - Visualización de tarjetas en grid
   - Apertura de modales
   - Panel de accesibilidad
   - Formularios de registro

## Resolución de Problemas Comunes

### El menú móvil se corta
**Causa**: `max-h` muy bajo o `overflow-hidden` sin scroll
**Solución**: Usar overlay full-screen con contenido scrolleable

### Los botones son muy pequeños en móvil
**Causa**: No usar clases responsive en padding
**Solución**: `px-2 sm:px-4` en lugar de `px-2` fijo

### El texto se sale del contenedor
**Causa**: Ancho fijo en lugar de responsive
**Solución**: Usar `w-full`, `max-w-*`, o breakpoints de Tailwind

### El modal no se ve completo en móvil
**Causa**: `max-h` o `h-*` muy grande para pantalla pequeña
**Solución**: `max-h-[95vh]` y padding reducido en móvil

## Futuras Mejoras

- [ ] Implementar gestos de swipe para navegación
- [ ] Optimizar imágenes con lazy loading responsive
- [ ] Añadir animaciones adaptadas a `prefers-reduced-motion`
- [ ] Mejorar tablas complejas con scroll horizontal en móvil
- [ ] PWA con manifest para instalación en móvil

## Recursos

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Mobile Web Best Practices](https://www.w3.org/TR/mobile-bp/)
