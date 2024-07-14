import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";

import mergedTypeDefs from './typeDefs/index.js';
import mergedResolvers from './resolvers/index.js';
import connectDB from './db/connectDB.js';
import { configurePassport } from './passport/passport.config.js';

dotenv.config();
//config passport
configurePassport();
const app = express();
// apollo httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

//set up session management
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
	uri: process.env.MONGO_URI,
	collection: "sessions",
});
// Catch errors
store.on('error', function(error) {
  console.log(error);
});

//set up session middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false, // this option specifies whether to save the session to the store on every request
		saveUninitialized: false, // option specifies whether to save uninitialized sessions
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true, // this option prevents the Cross-Site Scripting (XSS) attacks
		},
		store: store,
	})
);

//set up passport middleware and inform it to use express-session
app.use(passport.initialize());
app.use(passport.session());

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
	resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// Ensure we wait for our server to start
await server.start();

// Set up apollo Express middleware to handle CORS, body parsing,
// and expressMiddleware function.
app.use(
  '/',
  cors(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  //context func: to create a shared context for all GraphQL resolvers. 
  //This context is passed to every resolver function and 
  //can be used to share data, perform authentication, or access databases.
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res, User }),
  }),
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

//start database
await connectDB();
console.log(`🚀 Server ready at http://localhost:4000/`);