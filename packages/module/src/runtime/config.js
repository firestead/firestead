export const getDocument = (config) => config?.document ? config.document : ''

export const getSchedule = (config) => config?.schedule ? config.schedule : ''

export const getBucketName = (defaultBucketName, config) => config?.bucket ? config?.bucket: defaultBucketName