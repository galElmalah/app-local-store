# app-local-store
Easily persist app data.

## What is it good for?
This kind of persistent mechanism fits nicely in cli apps for storing config files.

## Installation
```bash
npm i --save app-local-store
```

## Usage
```typescript
import { anAppDataStore } from 'app-local-store';

/* 
The store data will be initialized with this data only on the first time a store is created.
You can also not provide this value and set it yourself using the store "write" method.
*/
const dataShape = {
  preference: {
    user: {...},
    system: {...}
  },
  scopes: ...
  ...
};

const appName = 'app'
const store = await anAppDataStore(appName, {initialData:dataShape});
const newUserPreference = {...}
await store.set("preference", {...initialData.preference, user: newUserPreference})

// On some other run of your app when getting the user preference it will be equal to "newUserPreference"
const { user } = await store.get("preference");

// Dump the entire app data to an object
const myAppData = await store.read();
```