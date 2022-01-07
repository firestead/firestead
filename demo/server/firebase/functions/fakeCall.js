import Chance from 'chance'

export const config = {
    auth: true
}

export default (data, context) => {
    console.log(data)
    const chance = new Chance()
    return {
        name: chance.name()
    }
}