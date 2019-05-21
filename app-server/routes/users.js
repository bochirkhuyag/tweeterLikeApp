var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');

var bcrypt = require('bcrypt');

const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './upload');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
});

var upload = multer({ storage: storage }).single('image');

router.route("/upload").post(function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            console.log('Error Occured' + err);
            return;
        }
        console.log('Photo Uploaded' + req.file.path);

        const updatedObj = {$set:{picture:"/photo/" + req.file.filename}};
        //req.params.userId
        const objId = new mongoose.Types.ObjectId('5ce2ff4c50e4b95988b9dce1');
        User.findOneAndUpdate({_id:objId},updatedObj,(err,doc)=>{
            if (err)  res.json({error:err});
            res.json({success:true});
        })
        //res.json({success:true});
    })

});

//get users
router.get('/', function(req, res) {
    User.find({},{password:0}).populate('followers._id following._id').exec((err,users)=>{
        res.json(users);
    })
});

//select one user by id
router.get('/:id',(req,res)=>{
    const objId = new mongoose.Types.ObjectId(req.params.id);
    User.findOne({'_id':objId},{password:0}).populate('followers._id following._id').exec((err,user)=>{
        res.json(user);
    })
})

//delete user by id
router.delete('/:userId',(req,res)=>{
    const objId = new mongoose.Types.ObjectId(req.params.userId);
    User.findByIdAndDelete({_id:objId},(err,doc)=>{
        if (err) throw err;
        res.json({success:true});
    })
})
//add user
router.post('/',(req,res)=>{
    const newObj =req.body;
    //console.log(newObj);
    var user = new User(newObj);
    //console.log(user);
    user.save(err=>{
        if(err) throw err;
        res.json({success:true});
    });
});

//register user
router.post('/register',(req,res)=>{
    const newObj =req.body;
    //console.log(newObj);
    var user = new User(newObj);
    //console.log(user);
    user.save(err=>{
        if(err) res.send({"error": "User already existed."});
        else {
            res.json({token:createToken(user), user:user});  
        }
        
    });
});
//Login
router.post('/login',(req,res)=>{

    User.findOne({'userName':req.body.userName},(err,user)=>{
        if(err) {
            res.send({"error": "User does not exist."});
        }
        if(user) {
            bcrypt.compare(req.body.password, user.password, (err, response)=>{
                if(response) {
                    res.json({token:createToken(user), user:user});
                } else {
                    console.log('login err');
                    res.send({"error": "Password is incorrect."});
                }
            });
        }

    })
});

function createToken(user) {
    const SECRET = 'SECRET';
    const payload = {user: user.id};
    const token = jwt.sign(payload, SECRET, {
        expiresIn: 1440000 // expires in 24 
        });

    return token;
};

//update user
router.put('/:userId',(req,res)=>{
    const updatedObj = req.body;
    User.findOneAndUpdate({_id:req.params.userId},updatedObj,(err,doc)=>{
        if (err)  throw err;
        res.json({success:true});
    })
});

//follow user

router.post('/:userId/follow/',(req,res)=>{
    const userIdObj = mongoose.Types.ObjectId(req.body.user);

    User.updateOne({_id:req.params.userId},{$addToSet:{following:{_id:userIdObj}}},(err,doc)=>{
        if(err) throw err;
        User.updateOne({_id:userIdObj},
            {$addToSet:{followers:{_id:mongoose.Types.ObjectId(req.params.userId)}}},(err,doc)=>{
                if(err) throw err;
                res.json({success:true});
            });
    });
});

//unfollow user
router.delete('/:userId/follow/',(req,res)=>{
    const userIdObj = mongoose.Types.ObjectId(req.body.user);

    User.updateOne({_id:req.params.userId},{$pull:{following:{user:userIdObj}}},(err,doc)=>{
        if(err) throw err;
        User.updateOne({_id:userIdObj},
            {$pull:{followers:{user:mongoose.Types.ObjectId(req.params.userId)}}},(err,doc)=>{
                if(err) throw err;
                res.json({success:true});
            });
    });
});


//find by name

router.get('/search/:searchString',(req,res)=>{
    User.find({userName:{$regex:req.params.searchString}},{password:0}).populate('followers._id following._id').exec((err,users)=>{
        res.json(users);
    })
});



module.exports = router;
