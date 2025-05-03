export interface PortraitCacheSettings {
  folder: string;
  inject: string;
  device: {
    dpr: number;
  };
}

export interface PortraitSizing {
  width: number;
  height: number;
}

export type IgnoreList = string[];
export type IgnoreFile = string;
