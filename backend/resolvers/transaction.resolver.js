import { transactions } from "../dummyData/data.js";
import Transaction from "../models/transaction.model.js";

const transactionResolver = {
    Query: {
        transactions: async (_,context) => {
            try{
                //get current user
                if(!context.getUser()){
                    throw new Error("Unauthorized");
                }
                //get this user's transactions
                const userId = context.getUser()._id;
                const transactions = await Transaction.find({ userId: userId });
                return transactions;

            }catch(error){
                console.error("Error getting transactions: ", error);
                throw new Error(error.message || "error getting transactions");
            }
        },
        transaction: async (_, { transactionId }, context) => {
            try{
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            }catch(e){
                console.error("Error getting transaction: ", e);
                throw new Error(e.message || "error getting transaction");
            }
        }
        //TODO: add category statistics query
    },
    Mutation: {
        createTransaction: async(_, {input}, context) => {
            try{
              const newTransaction = new Transaction({
                ...input,
                userId: context.getUser()._id
              })

              await newTransaction.save();
              return newTransaction;
            }catch(e){
                console.error("Error creating transaction: ", e);
                throw new Error(e.message || "error creating transaction");
            }
        },
        updateTransaction: async(_, {input}, context) => {
            try{
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new: true});
                return updatedTransaction;
            } catch(e){
                console.error("Error updating transaction: ", e);
                throw new Error(e.message || "error updating transaction");
            }
        },
        deleteTransaction: async(_, {transactionId}, context) => {
            try{
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            }catch(e){
                console.error("Error deleting transaction: ", e);
                throw new Error(e.message || "error deleting transaction");
            }
        },
    }
    //TODO: add TRANSACTION/USER relationship
};

export default transactionResolver;