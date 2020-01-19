System.import('single-spa')
    .then(function (singleSpa) {
        console.log('singleSpa', singleSpa)
        init(singleSpa);
    });

// import { Store, StoreConfig } from '@datorama/akita';

const { Store, StoreConfig } = require('@datorama/akita');

class GlobalEventDistributor {

    constructor() {
        this.stores = [];
    }

    registerStore(store) {
        this.stores.push(store);
    }

    dispatch(event) {
        this.stores.forEach((s) => s.dispatch(event));
    }
}


async function init(singleSpa) {
    console.log('got here');


    const globalEventDistributor = new GlobalEventDistributor();
    const loadingPromises = [];

    // app1: The URL "/app1/..." is being redirected to "http://localhost:9001/..." this is done by the webpack proxy (webpack.config.js)
    loadingPromises.push(loadApp('app1', '/app1', 'http://localhost:4201/main.js', './store.js', globalEventDistributor, singleSpa));

    // app2: The URL "/app2/..." is being redirected to "http://localhost:9002/..." this is done by the webpack proxy (webpack.config.js)
    loadingPromises.push(loadApp('app2', '/app2', 'http://localhost:4202/main.js', './store.js', globalEventDistributor, singleSpa));

    // app3: The URL "/app3/..." is being redirected to "http://localhost:9003/..." this is done by the webpack proxy (webpack.config.js)
    loadingPromises.push(loadApp('navbar', '/navbar', 'http://localhost:4300/main.js', null, null, singleSpa));

    // wait until all stores are loaded and all apps are registered with singleSpa
    Promise.all(loadingPromises).then(singleSpa.start())


}


function hashPrefix(prefix) {
    return function (location) {
        return location.hash.startsWith(`#${prefix}`);
    }
}

async function loadApp(name, hash, appURL, storeURL, globalEventDistributor, singleSpa) {
    // await System.import('@datorama/akita').then((akita)=>{console.log(akita)});
    let storeModule = {}, customProps = {};

    // try to import the store module
    // try {
    //
    //     storeModule = storeURL ? await System.import(storeURL) : {storeInstance: null};
    //
    // } catch (e) {
    //     console.log(`Could not load store of app ${name}.`, e);
    // }

    if (storeModule.storeInstance && globalEventDistributor) {
        // add a reference of the store to the customProps




        const initialState = {
            count: 0
        };

        function reducer(state = initialState, action) {
            switch (action.type) {
                case 'INCREMENT':
                    console.log('increment', state.count);
                    return {
                        count: state.count + 1
                    };
                case 'DECREMENT':
                    console.log('DECREMENT', state.count);
                    return {
                        count: state.count - 1
                    };
                default:
                    return state;
            }
        }

        const storeInstance = redux.createStore(reducer)


        customProps.store = storeModule.storeInstance;

        // register the store with the globalEventDistributor
        globalEventDistributor.registerStore(storeModule.storeInstance);
    }
    // register the app with singleSPA and pass a reference to the store of the app as well as a reference to the globalEventDistributor
    singleSpa.registerApplication(name, () => {
        return System.import(appURL.toString())
    }, () => {
        return location.pathname.startsWith(hash)
    }, customProps = {globalEventDistributor: GlobalEventDistributor});
}








