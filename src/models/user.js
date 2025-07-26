import mongoose, { Schema } from "mongoose";

// User Base Schema
const userSchema = new Schema({
  name: { type: String },
  role: {
    type: String,
    enum: ["Customer", "Admin", "DeliveryPartner"],
    required: true,
  },
  isActivated: { type: Boolean, default: false },
});

//Customer Schema

const CustomerSchema = new mongoose.Schema({
  ...userSchema.obj,
  phone: { type: Number, required: true, unique: true },
  role: { type: String, enum: ["Customer"], default: "Customer" },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: { type: String },
});


//Delivery Partner Schema 

const deliveryPartnerSchema = new mongoose.Schema({
  ...userSchema.obj,
  email:{type:String, required:true, unique:true},
  password:{type:String, required:true},
  phone: { type: Number, required: true, unique: true },
  role: { type: String, enum: ["DeliveryPartner"], default: "DeliveryPartner" },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: { type: String },
  branch:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Branch",
  }
});

//Admin Schema

const adminSchema = new mongoose.Schema({
    ...userSchema.obj,
     password:{type:String, required:true},
    email:{type:String,required:true, unique:true},
    role:{type:String, enum:["Admin"], default:"Admin"},
});