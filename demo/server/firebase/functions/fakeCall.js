import faker from '@faker-js/faker'

export const config = {
    auth: true
}

export default (data, context) => {
    console.log(data)
    faker.locale = "de"
    return {
        name: faker.name.findName()
    }
}