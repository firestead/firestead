export function getDefaultFirebaseRc(){
    return {}
}

export function getFirebaseConfig({ dev, environments }){
    const firebaseConfig = {}
    //TODO make it more configurable
    firebaseConfig.functions = {
      source: "functions",
      predeploy: []
    }
    firebaseConfig.storage = {
      rules: "storage.rules"
    }
    if(dev){
      firebaseConfig.emulators = {
        auth: {
          port: 9099
        },
        functions: {
          port: 5001
        },
        firestore: {
          port: 8080
        },
        database: {
          port: 9000
        },
        pubsub: {
          port: 8086
        },
        storage: {
          port: 9199
        },
        ui: {
          enabled: true
        }
      }
    }else{
      firebaseConfig.hosting = [
        {
          site: environments.envs[environments.current].config.projectId,
          public: 'functions/framework/public',
          cleanUrls: true,
          rewrites: [
            {
              source: '**',
              function: 'frameworkApp'
            }
          ]
        }
      ]
    }

    return firebaseConfig
}
export function getDefaultFirestoreIndexes(){
    return {
        indexes: [],
        fieldOverrides: []
      }
}

export function getDefaultFirestoreRules(){
    return `rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if
              request.time < timestamp.date(2022, 8, 11);
        }
      }
    }`
}

export function getDefaultStorageRules(){
  return `
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      match /{allPaths=**} {
        allow read, write;
      }
    }
  }`
}