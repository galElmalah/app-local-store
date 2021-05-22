import {anAppDataStore, doesPathExists} from '.'
import { afterThis } from 'jest-after-this';
import { Chance } from 'chance';
import * as fs from 'fs'

const c = Chance()
describe('appDataStore', () => {
  const appName = 'my-app'
  beforeEach(() =>{
    jest.restoreAllMocks()
  })
  const initialData = {
    preference: {
      user: {},
      system: {}
    },
    key:'value'
  }



  it('should not create a new storage file if one already exists', async () =>{
    const spy = jest.spyOn(fs.promises, 'writeFile')
    const dataStore = await anAppDataStore(appName, {initialData}) 
    await anAppDataStore(appName, {initialData}) 
    expect(spy).toBeCalledTimes(1)


    afterThis( () =>  dataStore.deleteStore())
  })

  it('should delete the store file', async () =>{
    const dataStore = await anAppDataStore(appName, {initialData}) 

    await dataStore.deleteStore()
    expect(await doesPathExists(dataStore.appStorageFilePath)).toBe(false);
  })

  it('should get the specified key', async () =>{
    const dataStore = await anAppDataStore(appName, {initialData}) 
    const spy = jest.spyOn(fs.promises, 'readFile')

    expect(await dataStore.get('preference')).toEqual(initialData.preference)
    expect(spy).not.toBeCalled()

    afterThis(() => dataStore.deleteStore())
  })

  it('should set the specified key value', async () =>{
    const value = c.word()
    const dataStore = await anAppDataStore(appName, {initialData}) 
    const spy = jest.spyOn(fs.promises, 'readFile')

    await dataStore.set('key', value); 

    expect(await dataStore.get('key')).toEqual(value)
    expect(spy).not.toBeCalled()

    afterThis(() => dataStore.deleteStore())
  })


  it('should delete the specified key', async () =>{
    const dataStore = await anAppDataStore(appName, {initialData}) 

    await dataStore.delete('key'); 

    expect(await dataStore.get('key')).toBeUndefined()

    afterThis(() => dataStore.deleteStore())
  })

  describe('appDataStore without cache', () => {
    it('should set the specified key value', async () =>{
      const value = c.word()
      const dataStore = await anAppDataStore(appName, {initialData, useCache:false}) 
      const spy = jest.spyOn(fs.promises, 'readFile')

      await dataStore.set('key', value); 

      expect(await dataStore.get('key')).toEqual(value)
      expect(spy).toBeCalledTimes(2)

      afterThis(() => dataStore.deleteStore())
    })

    it('should get the the value based on the specified key', async () =>{
      const dataStore = await anAppDataStore(appName, {initialData, useCache:false}) 
      const spy = jest.spyOn(fs.promises, 'readFile')

      expect(await dataStore.get('key')).toEqual(initialData.key)
      expect(spy).toBeCalledTimes(1)

      afterThis(() => dataStore.deleteStore())
    })
  })


})