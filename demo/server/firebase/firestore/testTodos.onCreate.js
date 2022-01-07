import Chance from 'chance'

export const config = {
    document: 'Todos/{itemId}'
}

export default (snapshot, context) => {
    const data = snapshot.data()
    const chance = new Chance()
    return snapshot.ref.set({
        content: chance.sentence({ words: 5 })
      }, {merge: true})
}