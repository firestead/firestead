import faker from 'faker'

export const config = {
    document: 'Todos/{itemId}'
}

export default (snapshot, context) => {
    const data = snapshot.data()
    return snapshot.ref.set({
        content: faker.lorem.words(5)
      }, {merge: true})
}