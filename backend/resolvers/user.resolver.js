//define the resolvers for the user schema
import { users } from '@/dummyData/data.js';

const userResolver = {
    Query: {
        authUser: () => {},
        users: () => {
            return users;
        }
    },
    Mutation: {}
}

export default userResolver;