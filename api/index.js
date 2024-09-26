const express=require('express');
const cors=require("cors");
const conectDB = require("./utils/db");
const User = require('./models/User');
const Place=require('./models/Place');
const Booking=require('./models/Booking');
const app=express();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const imageDownloader=require('image-downloader');
const cookieParser=require('cookie-parser');
const multer=require("multer");
const fs=require('fs');
require('dotenv').config()




app.use(express.json());
app.use(cookieParser());
app.use('/uploads',  express.static(__dirname+'/uploads'));
app.use(cors({
  credentials:true,
  origin:'http://localhost:3000',
}));



const secret=bcrypt.genSaltSync(10);
const jwtSecret='fdfdfdfdf';



//connecting mongodb
conectDB();


//API's

//register route
app.post('/register',async(req,res)=>{
  const {name,email,password}=req.body;
  try{
  const user=await User.create({
    name,
    email,
    password:bcrypt.hashSync(password,secret),
  });
  res.json(user);
} catch(e){
  res.status(422).json(e);
}
});

//login route
app.post('/login', async (req,res) => {
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});


//profile
app.get("/profile",(req,res)=>{
  const{token}=req.cookies;
  if(token){
    jwt.verify(token,jwtSecret,{},async(err,userData)=>{
      if(err) throw err;
      const {name,email,_id}=await User.findById(userData.id)
      res.json({name,email,_id});
      
    });
  }else{
    res.json(null)
  }
});

//logout route
app.post("/logout",(req,res)=>{
  res.cookie('token','').json(true);
});


app.post('/upload-by-link',async(req,res)=>{
  const {link}=req.body;
  const newName=Date.now() + '.jpg';
  await imageDownloader.image({
    url:link,
    dest:__dirname + '/uploads/' + newName,
  });
  res.json(newName);
})

//key points to remeber : 'photos' is coming from the Plcaespage in client 


const photosMiddleware=multer({dest:"uploads/"});
app.post('/upload',photosMiddleware.array('photos',100),(req,res)=>{
  const uploadedFiles=[];
  for(let i=0;i<req.files.length;i++){
    const {path,originalname}=req.files[i];
    const parts=originalname.split('.');
    const ext=parts[parts.length-1];
    const newPath=path + "." + ext;
    fs.renameSync(path,newPath);
    uploadedFiles.push(newPath.replace('uploads\\',''));
  }
  res.json(uploadedFiles);

});


//create places 
app.post('/places',(req,res)=>{
  const {token}=req.cookies;
  const {title,address,addPhotos,
    description,perks,extraInfo,
    checkIn,checkOut,maxGuest,price }=req.body;
  jwt.verify(token,jwtSecret,{},async(err,userData)=>{
    if(err) throw err;
  const placeDoc= await Place.create({
      owner:userData.id,
      title,address,photos:addPhotos,
     description,perks,extraInfo,
     checkIn,checkOut,maxGuest,price
    }); 
    res.json(placeDoc);
  });
})


//show all the places in the PlacesPagw
app.get("/user-places",(req,res)=>{
  const {token}=req.cookies;
  jwt.verify(token,jwtSecret,{},async(err,userData)=>{
    const {id}=userData;
    res.json(await Place.find({owner:id}));
  })

});

//gives us the places corresponding to the given id
app.get('/places/:id',async (req,res)=>{
  const {id}=req.params;
  res.json(await Place.findById(id));
});


//using put function to update the form and also update any changes in the places
app.put('/places',async(req,res)=>{
  const {token}=req.cookies;
  const {id,title,address,addPhotos,
    description,perks,extraInfo,
    checkIn,checkOut,maxGuest,price }=req.body;

    
    jwt.verify(token,jwtSecret,{},async(err,userData)=>{
      if(err) throw err;
      const placeDoc=await Place.findById(id); 
     if(userData.id===placeDoc.owner.toString()){
      placeDoc.set({
      title,address,photos:addPhotos,
      description,perks,extraInfo,
     checkIn,checkOut,maxGuest,price
      })
      await placeDoc.save()
      res.json('ok');
     }
     })

});

//
app.get('/places',async(req,res)=>{
  res.json(await Place.find());
});



//bookings api
app.post('/bookings',async(req,res)=>{
  const userData=await getUserDataFromToken(req);
  const {place,checkIn,checkOut,numberOfGuests,name,phone,price}=req.body;
  Booking.create({
    place,checkIn,checkOut,numberOfGuests,name,phone,
    price ,user:userData.id,
  }).then((doc)=>{
    res.json(doc);
  }).catch((err)=>{
    throw err;
  })
})



function getUserDataFromToken(req){
  return new Promise((resolve,reject)=>{
    jwt.verify(req.cookies.token,jwtSecret,{},async(err,userData)=>{
      if(err) throw err;
      resolve(userData);
    });
  })
}


app.get('/bookings',async(req,res)=>{
 const userData=await getUserDataFromToken(req);
 res.json( await Booking.find({user:userData.id}).populate('place'))
})

app.listen(4000);