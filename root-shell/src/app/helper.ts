import * as singleSpa from 'single-spa';

export function hashPrefix(prefix) {
  return (location) => {
    return location.hash.startsWith(`#${prefix}`);
  };
}

export async function loadApp(name, hash, appURL, storeURL, globalEventDistributor) {
  let storeModule: any = {};
  let customProps = {
    globalEventDistributor,
    store: {}
  };

  // try to import the store module
  try {
    storeModule = storeURL ? await import('./store') : {storeInstance: null};
  } catch (e) {
    console.log(`Could not load store of app ${name}.`, e);
  }

  if (storeModule.storeInstance && globalEventDistributor) {
    // add a reference of the store to the customProps
    customProps.store = storeModule.storeInstance;

    // register the store with the globalEventDistributor
    globalEventDistributor.registerStore(storeModule.storeInstance);
  }

  // // register the app with singleSPA and pass a reference to the store of the app as well as a reference to the globalEventDistributor
  // singleSpa.registerApplication(name, () => import(appURL.toString()), hashPrefix(hash), customProps);

  singleSpa.registerApplication(name, () => {
    return import(appURL);
  }, () => {
    return location.pathname.startsWith(hash);
  }, customProps = globalEventDistributor);
}


