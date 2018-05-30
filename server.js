const express = require('express');
const app=express();
const bodyParser= require('body-parser');
const jwt=require('jsonwebtoken');

const users=[
{
  name:"ravi",
  password:"ravi123"
},
{
  name:"chait",
  password:"chait123"
},
{
    name:"kumar",
    password:"kumar123"
},
{
    name:"vijay",
    password:"vijay123"
},
{
    name:"ajay",
    password:"ajay123"
},
{
    name:"sunil",
    password:"sunil123"
}
]


app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('./'));

app.get('/', (req,res) => {
    res.sendFile('index.html');
});

app.post('/login',(req,res) => {
    let message;
    let token;

    for(const user of users){
      if(user.name!=req.body.name){
          message="Wrong Name";
      }else{
          if(user.password!=req.body.password){
              message="Wrong Password";
              break;
          }
          else{
              token=jwt.sign(user,"topsecret");
              message="Login Successful";
              break;
          }
      }
    }
    if(token){
        res.status(200).json({
            message,
            token
        });
    }
    else{
        res.status(403).json({
            message
        });
    }
});

app.use((req, res, next)=>{
        // check header or url parameters or post parameters for token
        console.log(req.body);
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        if(token){
          console.log("token");
          jwt.verify(token,"topsecret",(err,decod)=>{
            if(err){
              res.status(403).json({
                message:"Wrong Token"
              });
            }
            else{
              console.log("success");
              req.decoded=decod;
              next();
            }
          });
        }
        else{
          res.status(403).json({
            message:"No Token"
          });
        }
});

app.post('/getusers',(req,res) => {
    const user_list=[];

    users.forEach((user)=> {
        user_list.push({"name":user.name});
    });

    res.send(JSON.stringify({users:user_list}));
});

app.listen(3000, function(){
  console.log('listening on port 3000');
});
