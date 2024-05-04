export interface Area {
  areaName: string;
}

export interface Region {
  regionName: string;
  areas: Area[];
}

export const REGION_LIST = [];
