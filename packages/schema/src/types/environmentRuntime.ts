export interface EnvVariableTargetRuntime{
    public: boolean,
    private: boolean,
}
export interface EnvVariable{
    value: string,
    firebase?: boolean,
    targets?: Record <string, EnvVariableTargetRuntime>
}
export interface FirebaseConfig{            
    projectId: string,
    apiKey?: string,
    authDomain?: string,
    storageBucket?: string,
    messagingSenderId?: string,
    appId?: string,
    measurementId?: string
}
export interface EnvironmentRuntime {
    name: string,
    config?: FirebaseConfig,
    envVariables?: Record <string,EnvVariable>
}