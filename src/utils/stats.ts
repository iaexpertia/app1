import { MountainPass, ConquestData, UserStats } from '../types';

export const calculateUserStats = (
  allPasses: MountainPass[],
  conquests: ConquestData[]
): UserStats => {
  const conqueredPassIds = new Set(conquests.map(c => c.passId));
  const conqueredPasses = allPasses.filter(pass => conqueredPassIds.has(pass.id));

  const totalElevationGain = conqueredPasses.reduce(
    (sum, pass) => sum + pass.elevationGain,
    0
  );

  const countries = [...new Set(conqueredPasses.map(pass => pass.country))];

  // Calcular dificultad media basada en el promedio de pendientes
  const avgDifficultyPercentage = conqueredPasses.length > 0
    ? conqueredPasses.reduce((sum, pass) => sum + pass.averageGradient, 0) / conqueredPasses.length
    : 0;

  return {
    totalPasses: allPasses.length,
    conqueredPasses: conqueredPassIds.size,
    totalElevationGain,
    averageDifficulty: `${avgDifficultyPercentage.toFixed(1)}%`,
    countriesVisited: countries
  };
};