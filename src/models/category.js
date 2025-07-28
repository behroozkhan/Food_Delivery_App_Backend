import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name: {type:String, require:true},
    image:{type:String, required:true}
});


const Category = mongoose.model("Category", categorySchema);

export default Category;