import faker from 'faker'
export const config = {}

export default (req, res) => {
    faker.locale = 'de'
    res.status(200).json({
        city: faker.address.city(),
        test: faker.lorem.sentence(10)
    })
}