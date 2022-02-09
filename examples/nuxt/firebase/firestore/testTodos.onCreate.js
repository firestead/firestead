import { faker } from '@faker-js/faker'

export const config = {
    document: 'Todos/{itemId}'
}

export default (snapshot, context) => {
    return snapshot.ref.set({
        content: faker.lorem.sentence()
      }, {merge: true})
}