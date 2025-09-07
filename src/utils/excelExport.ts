// Utility functions for exporting data to Excel (CSV format)

export interface ExportData {
  [key: string]: string | number | boolean | null | undefined;
}

// Convert data to CSV format
export const convertToCSV = (data: ExportData[], headers: string[]): string => {
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      
      // Handle null/undefined values
      if (value === null || value === undefined) {
        return '';
      }
      
      // Convert to string and escape CSV special characters
      const stringValue = String(value);
      
      // If the value contains comma, newline, or quotes, wrap in quotes and escape quotes
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Download CSV file
export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Export cyclists data
export const exportCyclists = (cyclists: any[]): void => {
  const headers = [
    'ID',
    'Nombre',
    'Alias',
    'Email',
    'Teléfono',
    'Edad',
    'Peso',
    'Fecha Registro',
    'Es Admin',
    'Número de Bicicletas',
    'Bicicletas'
  ];
  
  const data = cyclists.map(cyclist => ({
    'ID': cyclist.id,
    'Nombre': cyclist.name,
    'Alias': cyclist.alias || '',
    'Email': cyclist.email,
    'Teléfono': cyclist.phone,
    'Edad': cyclist.age || '',
    'Peso': cyclist.weight || '',
    'Fecha Registro': cyclist.registrationDate,
    'Es Admin': cyclist.isAdmin ? 'Sí' : 'No',
    'Número de Bicicletas': cyclist.bikes?.length || 0,
    'Bicicletas': cyclist.bikes?.map((bike: any) => 
      `${bike.brand} ${bike.model} (${bike.type}${bike.year ? `, ${bike.year}` : ''})`
    ).join('; ') || ''
  }));
  
  const csvContent = convertToCSV(data, headers);
  const filename = `ciclistas_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};

// Export brands data
export const exportBrands = (brands: any[]): void => {
  const headers = [
    'ID',
    'Nombre',
    'Categoría',
    'Descripción',
    'País',
    'Año Fundación',
    'Sitio Web',
    'Especialidades',
    'Destacada',
    'Activa'
  ];
  
  const data = brands.map(brand => ({
    'ID': brand.id,
    'Nombre': brand.name,
    'Categoría': brand.category,
    'Descripción': brand.description,
    'País': brand.country || '',
    'Año Fundación': brand.foundedYear || '',
    'Sitio Web': brand.website || '',
    'Especialidades': brand.specialties?.join('; ') || '',
    'Destacada': brand.featured ? 'Sí' : 'No',
    'Activa': brand.isActive ? 'Sí' : 'No'
  }));
  
  const csvContent = convertToCSV(data, headers);
  const filename = `marcas_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};

// Export collaborators data
export const exportCollaborators = (collaborators: any[]): void => {
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
  
  const data = collaborators.map(collaborator => ({
    'ID': collaborator.id,
    'Nombre': collaborator.name,
    'Categoría': collaborator.category,
    'Descripción': collaborator.description,
    'Email': collaborator.contactInfo?.email || '',
    'Teléfono': collaborator.contactInfo?.phone || '',
    'Sitio Web': collaborator.contactInfo?.website || '',
    'Dirección': collaborator.contactInfo?.address || '',
    'Número de Imágenes': collaborator.images?.length || 0,
    'Destacado': collaborator.featured ? 'Sí' : 'No',
    'Activo': collaborator.isActive ? 'Sí' : 'No'
  }));
  
  const csvContent = convertToCSV(data, headers);
  const filename = `colaboradores_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};

// Export news data
export const exportNews = (news: any[]): void => {
  const headers = [
    'ID',
    'Título',
    'Resumen',
    'Autor',
    'Fecha Publicación',
    'Categoría',
    'Tiempo Lectura',
    'Destacada',
    'URL Externa'
  ];
  
  const data = news.map(article => ({
    'ID': article.id,
    'Título': article.title,
    'Resumen': article.summary,
    'Autor': article.author,
    'Fecha Publicación': article.publishDate,
    'Categoría': article.category,
    'Tiempo Lectura': `${article.readTime} min`,
    'Destacada': article.featured ? 'Sí' : 'No',
    'URL Externa': article.externalUrl || ''
  }));
  
  const csvContent = convertToCSV(data, headers);
  const filename = `noticias_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};

// Export mountain passes data
export const exportMountainPasses = (passes: any[]): void => {
  const headers = [
    'ID',
    'Nombre',
    'País',
    'Región',
    'Altitud Máxima',
    'Desnivel',
    'Pendiente Media',
    'Pendiente Máxima',
    'Distancia',
    'Dificultad',
    'Categoría',
    'Latitud',
    'Longitud',
    'Descripción'
  ];
  
  const data = passes.map(pass => ({
    'ID': pass.id,
    'Nombre': pass.name,
    'País': pass.country,
    'Región': pass.region,
    'Altitud Máxima': `${pass.maxAltitude}m`,
    'Desnivel': `${pass.elevationGain}m`,
    'Pendiente Media': `${pass.averageGradient}%`,
    'Pendiente Máxima': `${pass.maxGradient}%`,
    'Distancia': `${pass.distance}km`,
    'Dificultad': pass.difficulty,
    'Categoría': pass.category,
    'Latitud': pass.coordinates?.lat || '',
    'Longitud': pass.coordinates?.lng || '',
    'Descripción': pass.description
  }));
  
  const csvContent = convertToCSV(data, headers);
  const filename = `puertos_montana_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csvContent, filename);
};

// Alias for backward compatibility
export const exportPasses = exportMountainPasses;