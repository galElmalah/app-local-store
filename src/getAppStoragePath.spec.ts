import {getAppStoragePath } from './getAppStoragePath'
import {Chance} from 'chance'

const c =  Chance()
describe('getAppStoragePath - path to where the data should be stored', () => {
  it('should return the correct path for darwin (MacOs) os', () => {
    const os = 'darwin'
    expect(getAppStoragePath(os)).toEqual(expect.stringContaining(`/Library/Application Support`))
  })

  it('should return the correct path for windows os', () => {
    const os = 'win32'
    expect(getAppStoragePath(os)).toEqual(expect.stringContaining(`/AppData/Roaming`))
  })

  it('should return the correct path for linux os', () => {
    const os = 'linux'
    expect(getAppStoragePath(os)).toEqual(expect.stringContaining(`/.config`))
  })

  it('should throw an error for unknown os', () => {
    const os = 'unknown' as any
    expect(() => getAppStoragePath(os)).toThrow()
  })
})