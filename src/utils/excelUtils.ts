import * as XLSX from 'xlsx';
import { MountainPass } from '../types';

export const exportPassesToExcel = (passes: MountainPass[]): void => {
  const data = passes.map(pass => ({
    'ID': pass.id,
    'Nombre': pass.name,
    'País': pass.country,
    'Región': pass.region,
    'Altitud Máxima (m)': pass.maxAltitude,
    'Desnivel (m)': pass.elevationGain,
    'Pendiente Media (%)': pass.averageGradient,
    'Pendiente Máxima (%)': pass.maxGradient,
    'Distancia (km)': pass.distance,
    'Dificultad': pass.difficulty,
    'Categoría': pass.category,
    'Latitud': pass.coordinates?.lat || '',
    'Longitud': pass.coordinates?.lng || '',
    'Descripción': pass.description,
    'URL Imagen': pass.imageUrl
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const columnWidths = [
    { wch: 20 },
    { wch: 30 },
    { wch: 15 },
    { wch: 20 },
    { wch: 18 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 50 },
    { wch: 50 }
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Puertos de Montaña');

  const filename = `puertos_montana_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

export const importPassesFromExcel = (file: File): Promise<MountainPass[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const passes: MountainPass[] = jsonData.map((row: any) => {
          const id = row['ID'] || row['id'] || `imported-${Date.now()}-${Math.random()}`;
          const name = row['Nombre'] || row['name'] || '';
          const country = row['País'] || row['country'] || '';
          const region = row['Región'] || row['region'] || '';
          const maxAltitude = parseInt(row['Altitud Máxima (m)'] || row['maxAltitude'] || '0');
          const elevationGain = parseInt(row['Desnivel (m)'] || row['elevationGain'] || '0');
          const averageGradient = parseFloat(row['Pendiente Media (%)'] || row['averageGradient'] || '0');
          const maxGradient = parseFloat(row['Pendiente Máxima (%)'] || row['maxGradient'] || '0');
          const distance = parseFloat(row['Distancia (km)'] || row['distance'] || '0');
          const difficulty = row['Dificultad'] || row['difficulty'] || 'Cuarta';
          const category = row['Categoría'] || row['category'] || 'Otros';
          const lat = parseFloat(row['Latitud'] || row['lat'] || '0');
          const lng = parseFloat(row['Longitud'] || row['lng'] || '0');
          const description = row['Descripción'] || row['description'] || '';
          const imageUrl = row['URL Imagen'] || row['imageUrl'] || '';

          return {
            id,
            name,
            country,
            region,
            maxAltitude,
            elevationGain,
            averageGradient,
            maxGradient,
            distance,
            difficulty: difficulty as any,
            category,
            coordinates: { lat, lng },
            description,
            imageUrl,
            famousWinners: []
          };
        });

        resolve(passes);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
};

export const downloadExcelTemplate = (): void => {
  const templateData = [
    {
      'ID': 'ejemplo-1',
      'Nombre': 'Puerto de Ejemplo',
      'País': 'España',
      'Región': 'Ejemplo',
      'Altitud Máxima (m)': 1500,
      'Desnivel (m)': 800,
      'Pendiente Media (%)': 7.5,
      'Pendiente Máxima (%)': 12,
      'Distancia (km)': 15,
      'Dificultad': 'Segunda',
      'Categoría': 'Otros',
      'Latitud': 40.0,
      'Longitud': -3.0,
      'Descripción': 'Descripción de ejemplo del puerto',
      'URL Imagen': 'https://ejemplo.com/imagen.jpg'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);

  const columnWidths = [
    { wch: 20 },
    { wch: 30 },
    { wch: 15 },
    { wch: 20 },
    { wch: 18 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 50 },
    { wch: 50 }
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Puertos de Montaña');

  XLSX.writeFile(workbook, 'plantilla_puertos_montana.xlsx');
};
