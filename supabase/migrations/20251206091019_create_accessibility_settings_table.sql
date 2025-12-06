/*
  # Crear tabla de configuración de accesibilidad

  1. Nueva Tabla
    - `accessibility_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key a auth.users)
      - `font_size` (text) - Tamaño de fuente: 'normal', 'large', 'extra-large'
      - `contrast` (text) - Modo de contraste: 'normal', 'high', 'low'
      - `night_mode` (boolean) - Modo nocturno activado/desactivado
      - `blue_filter` (boolean) - Filtro azul activado/desactivado
      - `hide_images` (boolean) - Ocultar imágenes activado/desactivado
      - `reduce_motion` (boolean) - Reducir animaciones activado/desactivado
      - `text_to_speech` (boolean) - Lectura en voz alta activado/desactivado
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Seguridad
    - Habilitar RLS en la tabla `accessibility_settings`
    - Políticas para que los usuarios autenticados solo puedan leer y actualizar su propia configuración
*/

CREATE TABLE IF NOT EXISTS accessibility_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  font_size text DEFAULT 'normal' CHECK (font_size IN ('normal', 'large', 'extra-large')),
  contrast text DEFAULT 'normal' CHECK (contrast IN ('normal', 'high', 'low')),
  night_mode boolean DEFAULT false,
  blue_filter boolean DEFAULT false,
  hide_images boolean DEFAULT false,
  reduce_motion boolean DEFAULT false,
  text_to_speech boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE accessibility_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own accessibility settings"
  ON accessibility_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accessibility settings"
  ON accessibility_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accessibility settings"
  ON accessibility_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own accessibility settings"
  ON accessibility_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_accessibility_settings_user_id ON accessibility_settings(user_id);
