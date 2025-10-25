/*
  # Eliminar campo categoría de puertos de montaña

  1. Cambios
    - Elimina la columna `category` de la tabla `mountain_passes`
    
  2. Motivo
    - La aplicación ahora usa `region` para agrupar y filtrar puertos
    - El campo `category` ya no es necesario y ha sido eliminado de la interfaz
    
  3. Nota
    - Esta operación es segura ya que la aplicación ya no utiliza este campo
*/

-- Eliminar la columna category de la tabla mountain_passes
ALTER TABLE mountain_passes 
DROP COLUMN IF EXISTS category;
