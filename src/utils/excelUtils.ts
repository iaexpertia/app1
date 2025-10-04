import { MountainPass } from '../types';

const escapeCSVValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

export const exportPassesToExcel = (passes: MountainPass[]): void => {
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
    'Descripción',
    'URL Imagen'
  ];

  const rows = passes.map(pass => [
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
    pass.description,
    pass.imageUrl
  ]);

  const csvContent = [
    headers.map(escapeCSVValue).join(','),
    ...rows.map(row => row.map(escapeCSVValue).join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `puertos_montana_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importPassesFromExcel = (file: File): Promise<MountainPass[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          reject(new Error('El archivo está vacío o no tiene datos'));
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const passes: MountainPass[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values: string[] = [];
          let current = '';
          let inQuotes = false;

          for (let char of lines[i]) {
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim().replace(/^"|"$/g, ''));
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim().replace(/^"|"$/g, ''));

          if (values.length >= 15) {
            const pass: MountainPass = {
              id: values[0] || `imported-${Date.now()}-${i}`,
              name: values[1] || '',
              country: values[2] || '',
              region: values[3] || '',
              maxAltitude: parseInt(values[4]) || 0,
              elevationGain: parseInt(values[5]) || 0,
              averageGradient: parseFloat(values[6]) || 0,
              maxGradient: parseFloat(values[7]) || 0,
              distance: parseFloat(values[8]) || 0,
              difficulty: (values[9] || 'Cuarta') as any,
              category: values[10] || 'Otros',
              coordinates: {
                lat: parseFloat(values[11]) || 0,
                lng: parseFloat(values[12]) || 0
              },
              description: values[13] || '',
              imageUrl: values[14] || '',
              famousWinners: []
            };
            passes.push(pass);
          }
        }

        resolve(passes);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};

export const downloadExcelTemplate = (): void => {
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
    'Descripción',
    'URL Imagen'
  ];

  const exampleRow = [
    'ejemplo-1',
    'Puerto de Ejemplo',
    'España',
    'Ejemplo',
    '1500',
    '800',
    '7.5',
    '12',
    '15',
    'Segunda',
    'Otros',
    '40.0',
    '-3.0',
    'Descripción de ejemplo del puerto',
    'https://ejemplo.com/imagen.jpg'
  ];

  const csvContent = [
    headers.map(escapeCSVValue).join(','),
    exampleRow.map(escapeCSVValue).join(',')
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'plantilla_puertos_montana.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
