
const express= require('express')
const user = express();
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

//__________________CONTROLLERS___________________________
const userController= require('../Controllers/userController');
const AccountController=require('../Controllers/accountController');
const PolicyController=require('../Controllers/policyController');
const AgentController = require("../Controllers/agentController");
const LobController = require('../Controllers/LOBController');
const CarrierController = require("../Controllers/CarrierController");


user.use(bodyParser.json());
user.use(bodyParser.urlencoded({ extended: true }));


user.use(express.static(path.join(__dirname,'Public')));

var storage= multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null,'./Public/')
    },
    filename:(req,file,cb)=>{
       cb(null,file.originalname)
    }
});
var upload= multer({storage:storage});
//____________________________________________ROUTES________________________________________

//api for csv 
user.post('/importUser', upload.single('file'),userController.importUser)

//user
user.post("/createUser", userController.createUser)
user.get("/getUsers", userController.getUsers)
user.put("/users/:userId",userController.updateUsers)
user.delete("/users/:userId",userController.deleteUser)

//account
user.post("/createAccount", AccountController.createAccount)
user.get("/getAccount", AccountController.getAccount)
user.put("/account/:accountId",AccountController.updateAccount)
user.delete("/account/:accountId",AccountController.deleteAccount)

//policy
user.post("/createPolicy", PolicyController.createPolicy)
user.get("/getPolicy", PolicyController.getPolicy)
user.put("/policy/:policyId",PolicyController.updatePolicy)
user.delete("/policy/:policyId",PolicyController.deletePolicy)

//agent
user.post("/createAgent", AgentController.createAgent)

//LOB
user.post("/createLOb",LobController.createLOb)

//createCarrier
user.post("/createCarrier",CarrierController.createCarrier)


module.exports= user;
