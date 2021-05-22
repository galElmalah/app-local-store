import { join } from 'path';
import { homedir } from 'os';
import { platform } from 'os';

type Platform = ReturnType<typeof platform>;
export const MAC_OS = 'darwin';
export const WINDOWS_OS = 'win32';
export const LINUX_OS = 'linux';

export const getAppStoragePath = (os: Platform): string => {
  const pathsMap = {
    [MAC_OS]: () => join(homedir(), 'Library', 'Application\ Support'),
    [LINUX_OS]: () => join(homedir(), '.config'),
    [WINDOWS_OS]: () => join(homedir(), 'AppData', 'Roaming'),
  };

  const appStoragePathGetter = pathsMap[os];

  if (!appStoragePathGetter) {
    throw new Error(`Could not construct a path for os "${os}".`);
  }

  return appStoragePathGetter();
};
