//define the resolvers for the user schema
import { users } from '../dummyData/data.js';

const userResolver = {
    Query: {
        authUser: () => {},
        users: () => {
            return users;
        },
        user: (_, {userId}) => {
            return users.find(user => user._id === userId)
        }
    },
    Mutation: {}
}

export default userResolver;