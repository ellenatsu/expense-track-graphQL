//define the resolvers for the user schema
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';


const userResolver = {
    Query: {
        //get authenticate user
        authUser:  (parent, args,context) => {
            // try{
            //     //graphql passport method
            //     const user = await context.getUser();
            //     console.log("in backend resolver Authenticated user: ", user);
            //     return user;
            // }catch(e){
            //     console.error("Error getting authenticated user: ", e);
            //     throw new Error(e.message || "internal server error");
            // }
            return  context.getUser();
        },
        //fetch single user
        user: async (_, {userId}) => {
            try{
                //mongoose method
                const user = await User.findById(userId);
                return user;

            }catch(e){
                console.error("Error getting user: ", e);
                throw new Error(e.message || "error getting user");
            }
        }
        //TODO: add user/transaction relationship
    },
    Mutation: {
        signUp: async (_, {input}, context) => {
            try{
                const { username, name, password, gender} = input;

                if(!username || !name || !password || !gender){
                    throw new Error("All fields are required");
                }
                //check if the user already exists
                const existingUser = await User.findOne({username});
                if(existingUser){
                    throw new Error("User already exists");
                }

                //create a new user
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

				// free avatar placeholder
				const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
				const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

				const newUser = new User({
					username,
					name,
					password: hashedPassword,
					gender,
					profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
				});

                //mongoose save method
				await newUser.save();
                //login is the passport graphql method
                await context.login(newUser);
                return newUser;

            }catch(err){
                console.error("Error signing up user: ", err);
                throw new Error(err.message || "internal server error");
            }
        },

        login: async(_, {input}, context) => {
            //
            try{
                //get user from input
                const {username, password} = input;
                //auth
                const {user} = await context.authenticate("graphql-local", {username, password});
                
                await new Promise((resolve, reject) => {
                    context.login(user, (err) => {
                      if (err) {
                        console.error("Login error:", err);
                        reject(new Error("Login failed"));
                      } else {
                        console.log("Login successful");
                        resolve();
                      }
                    });
                  });
                  console.log('--- login response ---');
                  console.log(`isAuthenticated: ${context.isAuthenticated()}`);
                  console.log(`isUnauthenticated: ${context.isUnauthenticated()}`);
                  console.log(`getUser: ${context.getUser()}`);
            
                  return  user ;

            }catch(e){
                console.error("Error logging in user: ", e);
                throw new Error(e.message || "internal server error");
            }
        },

        logout: async(_, __, context) => {
            try{
                await context.logout();
                //clear the cookie
                context.req.session.destroy((err)=>{
                    if(err){
                        console.error("Error logging out user: ", err);
                        throw new Error(err.message || "internal server error");}
                })
                context.res.clearCookie("connect.sid");

                return {
                    message: "Logged out successfully"
                };
            }catch(e){
                console.error("Error logging out user: ", e);
                throw new Error(e.message || "internal server error");
            }
        }
    }
}

export default userResolver;