/*
  # Add estado_validacion field to mountain_passes table

  1. Changes
    - Add new column `estado_validacion` (text) to `mountain_passes` table
    - Default value: 'Pendiente'
    - Possible values: 'Pendiente', 'Validado', 'Rechazado'
    - Update existing records to reflect their current validation status:
      * is_validated = true → 'Validado'
      * is_validated = false → 'Pendiente'

  2. Notes
    - This new field provides more flexibility for validation workflows
    - The existing `is_validated` boolean field will remain for backward compatibility
    - Future validations should update both fields to maintain consistency
*/

-- Add the estado_validacion column with default value 'Pendiente'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'mountain_passes' AND column_name = 'estado_validacion'
  ) THEN
    ALTER TABLE mountain_passes 
    ADD COLUMN estado_validacion text DEFAULT 'Pendiente';
  END IF;
END $$;

-- Update existing records to reflect their current validation status
UPDATE mountain_passes
SET estado_validacion = CASE 
  WHEN is_validated = true THEN 'Validado'
  ELSE 'Pendiente'
END
WHERE estado_validacion IS NULL OR estado_validacion = 'Pendiente';

-- Add a check constraint to ensure valid values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'mountain_passes_estado_validacion_check'
  ) THEN
    ALTER TABLE mountain_passes
    ADD CONSTRAINT mountain_passes_estado_validacion_check
    CHECK (estado_validacion IN ('Pendiente', 'Validado', 'Rechazado'));
  END IF;
END $$;
