import { transactions } from "../dummyData/data.js";

const transactionResolver = {
    Query: {
        transactions: async (_, _, context) => {
            try{
                //get current user
                if(!context.getUser()){
                    throw new Error("Unauthorized");
                }

            }catch(error){
                console.error("Error getting transactions: ", error);
                throw new Error(error.message || "error getting transactions");
            }
        },
        transaction: (_, { transactionId }) => {
            return transactions.find(transaction => transaction._id === transactionId);
        }
    },
    Mutation: {}
};

export default transactionResolver;