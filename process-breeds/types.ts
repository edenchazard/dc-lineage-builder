import type { Device } from 'puppeteer';

export interface PortraitCacheSettings {
  folder: string;
  inject: string;
  device: {
    dpr: number;
    device: Device | null;
  };
}

export interface PortraitSizing {
  width: number;
  height: number;
}

export type IgnoreList = string[];
export type IgnoreFile = string;
