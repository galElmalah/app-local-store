import { platform } from 'os';
import * as fs from 'fs';
import { getAppStoragePath } from './getAppStoragePath';
import { doesFileExist } from './doesFileExist';

interface StoreOptions<T> {
  useCache?: boolean;
  initialData?:Partial<T>
}

const defaultOptions = {
  useCache: true,
  initialData: {}
};
export const anAppDataStore = async <T>(
  appName: string,
  _options: StoreOptions<T> = {}
) => {
  const { useCache, initialData } = {
    ...defaultOptions,
    ..._options,
  };

  const storagePath = getAppStoragePath(platform());
  const appStorageFilePath = `${storagePath}/${appName}.json`;

  let localCopy = {...initialData} as T;

  const api = {
    appStorageFilePath,
    read: async () => {
      if(useCache) {
        return localCopy
      }
      const data = await fs.promises.readFile(appStorageFilePath, 'utf-8');
      
      return JSON.parse(data) as T;
    },
    write: async (data: T) => {
      await fs.promises.writeFile(
        appStorageFilePath,
        JSON.stringify(data),
        'utf-8'
      );
      if (useCache) {
        localCopy = data;
      }
    },
    /**
     * After calling this method the store is no longer usable
     */
    deleteStore: async () => {
      await fs.promises.unlink(appStorageFilePath);
      if (useCache) {
        localCopy = null;
      }
    },
    set: async <K extends keyof T>(key: keyof T, value: T[K]) => {
      const data = await api.read();
      data[key] = value;
      await api.write(data);
      if (useCache) {
        localCopy[key] = value;
      }
    },
    get: async <K extends keyof T>(key: K): Promise<T[K]> => {
      if (useCache) {
        return localCopy[key];
      }
      const data = await api.read();
      return data[key];
    },
    delete: async <K extends keyof T>(key: K): Promise<void> => {
      const data = await api.read();
      delete data[key];
      await api.write(data);
      if (useCache) {
        delete localCopy[key];
      }
    },
  };

  /**
   * Initialized the store data file.
   * This will happen when its the first time that data is being saved for that app.
   */
  if (!(await doesFileExist(appStorageFilePath))) {
    await api.write(initialData as T);
  }

  return api;
};
