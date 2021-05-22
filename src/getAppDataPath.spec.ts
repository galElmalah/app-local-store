import {getAppDataPath } from './getAppDataPath'
import {Chance} from 'chance'

const c =  Chance()
describe('getAppDataPath - path to where the data should be stored', () => {
  it('should return the correct path for darwin (MacOs) os', () => {
    const os = 'darwin'
    expect(getAppDataPath(os)).toEqual(expect.stringContaining(`/Library/Application Support`))
  })

  it('should return the correct path for windows os', () => {
    const os = 'win32'
    expect(getAppDataPath(os)).toEqual(expect.stringContaining(`/AppData/Roaming`))
  })

  it('should return the correct path for linux os', () => {
    const os = 'linux'
    expect(getAppDataPath(os)).toEqual(expect.stringContaining(`/.config`))
  })
})