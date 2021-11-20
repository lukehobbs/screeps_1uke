export const getContainers = (structures: AnyStructure[]): StructureContainer[] => {
  return structures.filter(s => s.structureType === STRUCTURE_CONTAINER) as StructureContainer[];
};

export const getStorages = (structures: AnyStructure[]): StructureStorage[] => {
  return structures.filter(s => s.structureType === STRUCTURE_STORAGE) as StructureStorage[];
};

export const getTowers = (structures: AnyStructure[]): StructureTower[] => {
  return structures.filter(s => s.structureType === STRUCTURE_TOWER) as StructureTower[];
};

export const getLinks = (structures: AnyStructure[]): StructureLink[] => {
  return structures.filter(s => s.structureType === STRUCTURE_LINK) as StructureLink[];
};

export const getExtensions = (structures: AnyStructure[]): StructureExtension[] => {
  return structures.filter(s => s.structureType === STRUCTURE_EXTENSION) as StructureExtension[];
};