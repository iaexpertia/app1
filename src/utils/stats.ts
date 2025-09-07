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
  
  const difficultyMap = { Easy: 1, Medium: 2, Hard: 3, Extreme: 4 };
  const avgDifficulty = conqueredPasses.length > 0 
    ? conqueredPasses.reduce((sum, pass) => sum + difficultyMap[pass.difficulty], 0) / conqueredPasses.length
    : 0;
    
  const difficultyNames = ['Easy', 'Medium', 'Hard', 'Extreme'];
  const averageDifficultyName = difficultyNames[Math.round(avgDifficulty) - 1] || 'Beginner';

  return {
    totalPasses: allPasses.length,
    conqueredPasses: conquests.length,
    totalElevationGain,
    averageDifficulty: averageDifficultyName,
    countriesVisited: countries
  };
};