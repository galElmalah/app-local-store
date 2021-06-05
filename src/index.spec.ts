import { anAppDataStore } from '.';
import { afterThis } from 'jest-after-this';
import { Chance } from 'chance';
import * as fs from 'fs';
import { doesFileExist } from './doesFileExist';

const c = Chance();

describe('appDataStore', () => {
  const appName = 'my-app';
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  const initialData = {
    preference: {
      user: {},
      system: {},
    },
    key: 'value',
  };

  const makeStore = async (name = appName, useCache = true) => {
    const dataStore = await anAppDataStore(name, { useCache, initialData });
    afterThis(() => dataStore.deleteStore());
    return dataStore;
  };

  it('should not create a new storage file if one already exists', async () => {
    const spy = jest.spyOn(fs.promises, 'writeFile');
    await makeStore();
    await anAppDataStore(appName, { initialData });
    expect(spy).toBeCalledTimes(1);
  });

  it('should delete the store file', async () => {
    const dataStore = await anAppDataStore(appName, { initialData });

    await dataStore.deleteStore();

    expect(await doesFileExist(dataStore.appStorageFilePath)).toBe(false);
  });

  it('should get the specified key', async () => {
    const dataStore = await makeStore();
    const spy = jest.spyOn(fs.promises, 'readFile');

    expect(await dataStore.get('preference')).toEqual(initialData.preference);
    expect(spy).not.toBeCalled();
  });

  it('should set the specified key value', async () => {
    const value = c.word();
    const dataStore = await makeStore();


    await dataStore.set('key', value);

    expect(await dataStore.get('key')).toEqual(value);
  });

  it('should delete the specified key', async () => {
    const dataStore = await makeStore();

    await dataStore.delete('key');

    expect(await dataStore.get('key')).toBeUndefined();
  });

  describe('appDataStore without cache', () => {
    it('should set the specified key value', async () => {
      const value = c.word();
      const dataStore = await makeStore(appName, false);
      const spy = jest.spyOn(fs.promises, 'readFile');

      await dataStore.set('key', value);

      expect(await dataStore.get('key')).toEqual(value);
      expect(spy).toBeCalledTimes(2);
    });

    it('should get the the value based on the specified key', async () => {
      const dataStore = await makeStore(appName, false);

      const spy = jest.spyOn(fs.promises, 'readFile');

      expect(await dataStore.get('key')).toEqual(initialData.key);
      expect(spy).toBeCalledTimes(1);
    });
  });
});
