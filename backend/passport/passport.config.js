import passport from "passport";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

//set up authentication
export const configurePassport = async () => {
    //save the user's ID to the session 
	passport.serializeUser((user, done) => {
		console.log("Serializing user");
		done(null, user.id);
	});
    
    //searching all users in db and get user back
	passport.deserializeUser(async (id, done) => {
		console.log("Deserializing user");
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch (err) {
			done(err);
		}
	});

	passport.use(
		new GraphQLLocalStrategy(async (username, password, done) => {
			try {
				const user = await User.findOne({ username });
				if (!user) {
					throw new Error("Invalid username or password");
				}
				const validPassword = await bcrypt.compare(password, user.password);

				if (!validPassword) {
					throw new Error("Invalid username or password");
				}

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		})
	);
};