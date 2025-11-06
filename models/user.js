const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema= new Schema({
   username: {
         type:String,
         required:true,
         unique:true,
         lowercase:true,
         trim:true
   },
     email:{
        type:String,
        required:true,
         unique:true,
         trim:true
     },
     favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Listing'
     }]
   },
   {timestamps:true}
)

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);