// Utility functions for exporting data to Excel format
export interface ExcelData {
  headers: string[];
  data: (string | number | boolean)[][];
  filename: string;
}

// Convert data to CSV format (Excel compatible)
export const convertToCSV = (data: ExcelData): string => {
  const { headers, data: rows } = data;
  
  // Escape CSV values
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    // If value contains comma, newline, or quote, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };
  
  // Create CSV content
  const csvHeaders = headers.map(escapeCSV).join(',');
  const csvRows = rows.map(row => 
    row.map(escapeCSV).join(',')
  ).join('\n');
  
  return `${csvHeaders}\n${csvRows}`;
};

// Download CSV file
export const downloadCSV = (data: ExcelData): void => {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${data.filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Export cyclists data
export const exportCyclistsToExcel = (cyclists: any[]): void => {
  const headers = [
    'ID',
    'Nombre',
    'Alias',
    'Email',
    'Teléfono',
    'Edad',
    'Peso (kg)',
    'Fecha de Registro',
    'Es Admin',
    'Número de Bicicletas',
    'Bicicletas (Detalles)'
  ];
  
  const data = cyclists.map(cyclist => [
    cyclist.id,
    cyclist.name,
    cyclist.alias || '',
    cyclist.email,
    cyclist.phone,
    cyclist.age || '',
    cyclist.weight || '',
    cyclist.registrationDate,
    cyclist.isAdmin ? 'Sí' : 'No',
    cyclist.bikes?.length || 0,
    cyclist.bikes?.map((bike: any) => 
      `${bike.brand} ${bike.model} (${bike.type}${bike.year ? `, ${bike.year}` : ''})`
    ).join('; ') || ''
  ]);
  
  downloadCSV({
    headers,
    data,
    filename: `ciclistas_${new Date().toISOString().split('T')[0]}`
  });
};

// Export brands data
export const exportBrandsToExcel = (brands: any[]): void => {
  const headers = [
    'ID',
    'Nombre',
    'Categoría',
    'Descripción',
    'País',
    'Año de Fundación',
    'Sitio Web',
    'Especialidades',
    'Destacada',
    'Activa'
  ];
  
  const data = brands.map(brand => [
    brand.id,
    brand.name,
    brand.category,
    brand.description,
    brand.country || '',
    brand.foundedYear || '',
    brand.website || '',
    brand.specialties?.join('; ') || '',
    brand.featured ? 'Sí' : 'No',
    brand.isActive ? 'Sí' : 'No'
  ]);
  
  downloadCSV({
    headers,
    data,
    filename: `marcas_${new Date().toISOString().split('T')[0]}`
  });
};

// Export collaborators data
export const exportCollaboratorsToExcel = (collaborators: any[]): void => {
  const headers = [
    'ID',
    'Nombre',
    'Categoría',
    'Descripción',
    'Email',
    'Teléfono',
    'Sitio Web',
    'Dirección',
    'Número de Imágenes',
    'Destacado',
    'Activo'
  ];
  
  const data = collaborators.map(collaborator => [
    collaborator.id,
    collaborator.name,
    collaborator.category,
    collaborator.description,
    collaborator.contactInfo?.email || '',
    collaborator.contactInfo?.phone || '',
    collaborator.contactInfo?.website || '',
    collaborator.contactInfo?.address || '',
    collaborator.images?.length || 0,
    collaborator.featured ? 'Sí' : 'No',
    collaborator.isActive ? 'Sí' : 'No'
  ]);
  
  downloadCSV({
    headers,
    data,
    filename: `colaboradores_${new Date().toISOString().split('T')[0]}`
  });
};

// Export mountain passes data
export const exportPassesToExcel = (passes: any[]): void => {
  const headers = [
    'ID',
    'Nombre',
    'País',
    'Región',
    'Altitud Máxima (m)',
    'Desnivel (m)',
    'Pendiente Media (%)',
    'Pendiente Máxima (%)',
    'Distancia (km)',
    'Dificultad',
    'Categoría',
    'Latitud',
    'Longitud',
    'Descripción'
  ];
  
  const data = passes.map(pass => [
    pass.id,
    pass.name,
    pass.country,
    pass.region,
    pass.maxAltitude,
    pass.elevationGain,
    pass.averageGradient,
    pass.maxGradient,
    pass.distance,
    pass.difficulty,
    pass.category,
    pass.coordinates?.lat || '',
    pass.coordinates?.lng || '',
    pass.description
  ]);
  
  downloadCSV({
    headers,
    data,
    filename: `puertos_montana_${new Date().toISOString().split('T')[0]}`
  });
};