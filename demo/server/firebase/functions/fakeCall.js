import faker from 'faker'

export const config = {
    auth: true
}

export default (data, context) => {
    console.log(data)
    return {
        name: faker.name.findName()
    }
}