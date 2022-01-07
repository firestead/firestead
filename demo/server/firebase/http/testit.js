import Chance from 'chance'

export const config = {}

export default (req, res) => {
    const chance = new Chance()
    res.status(200).json({
        city: chance.city(),
        state: chance.state({ full: true })
    })
}