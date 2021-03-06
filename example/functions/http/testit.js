import { faker } from '@faker-js/faker'

export const config = {}

export default (req, res) => {
    faker.locale = "de"
    res.status(200).json({
        runtimeConfig: process.env,
        city: faker.address.city(),
        state: faker.address.state()
    })
}