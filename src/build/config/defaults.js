export function getDefaultFirebaseRc(){
    return {}
}

export function getDefaultFirebaseConfig(){
    return {
        functions: {
          source: "functions",
          predeploy: []
        },
        emulators: {
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
          ui: {
            enabled: true
          }
        }
      }
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