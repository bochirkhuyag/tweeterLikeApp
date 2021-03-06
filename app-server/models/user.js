var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
//user schema
mongoose.set('useCreateIndex', true);
var userSchema = new mongoose.Schema({
    userName:{type:String,index:true,unique:true,required:true},
    password:{type:String,required:true},
    picture:{type:String},
    createdDate:{type:Date,default:Date.now()},
    firstName:{type:String},
    lastName:{type:String},
    bio:{type:String},
    gender:String,
    followers: [{_id:{type: mongoose.Schema.Types.ObjectId, ref: 'users'}, followedAt:{type:Date,default:Date.now()}}],
    following: [{_id:{type: mongoose.Schema.Types.ObjectId, ref: 'users'}, followedAt:{type:Date,default:Date.now()}}],
    email:{type:String,required:true,unique:true}
});

//userSchema index
userSchema.index({userName:1,email:1});

//hash the password
userSchema.pre('save',function(next){
    bcrypt.hash(this.password,10,(err,hash)=>{
        this.password=hash;
        next();
    });

});


userSchema.statics.findById = function(id,cb){
    return this.find({_id:mongoose.Types.ObjectId(id)},{_id:0,userName:1},cb);
}

module.exports=mongoose.model('users',userSchema);