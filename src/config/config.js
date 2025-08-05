import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/index.js";

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;

const MongoDbStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDbStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

sessionStore.on("error", (error) => {
  console.log("Session store error", error);
});

export const autheticate = async (email, password) => {
  if (email && password) {
    if (email == "behroozkhan77@gmail.com" && password === "behrooz1234456") {
      return Promise.resolve({ email: email, password: password });
    } else {
      return null;
    }
  }

  //MANUALLY ADMIN CREATED IN DATBASE
  // if(email && password){
  //     const user = await Admin.findOne({email});
  //     if(!user){
  //         return null;
  //     }
  //     if(user.password === password){
  //         return Promise.resolve({email:email, password:password});
  //     }else{
  //         return null;
  //     };
  // }

  return null;
};
