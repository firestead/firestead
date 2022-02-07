import faker from '@faker-js/faker'

export const config = {
    document: 'Todos/{itemId}'
}

export default (snapshot, context) => {
    const data = snapshot.data()
    faker.locale = "de"
    return snapshot.ref.set({
        content: faker.lorem.sentence()
      }, {merge: true})
}