import faker from 'faker'
export const config = {}

export default (req, res) => {
    faker.locale = 'de'
    res.status(200).json({
        test: faker.lorem.text(),
        city: faker.address.city()
    })
}