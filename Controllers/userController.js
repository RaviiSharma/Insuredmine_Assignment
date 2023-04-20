var ImportData= require('../Models/ImportData');
var userModel= require('../Models/User');

var csv = require('csvtojson');
//importUser csv file 
const importUser= async(req,res)=>{

    try{
        var userData=[];
        csv()
        .fromFile(req.file.path)
        .then(async (response)=>{
           //console.log(response); 
             for (var x=0; x< response.length;x++){
                userData.push({
                    //users
                    firstname:response[x].firstname,
                    dob:response[x].dob,
                    zip:response[x].zip,
                    email:response[x].email,
                    phone:response[x].phone,
                    address:response[x].address,
                    state:response[x].state,
                    city:response[x].city,
                    //users account
                    account_name:response[x].account_name,
                    account_type:response[x].account_type,
                    permium_amount:response[x].permium_amount,
                    permium_amount_written:response[x].permium_amount_written,
                    //policy
                    policy_mode:response[x].policy_mode,
                    policy_number:response[x].policy_number,
                    policy_type:response[x].policy_type,
                    policy_start_date:response[x].policy_start_date,
                    policy_end_date:response[x].policy_end_date,
                    //agent
                    agent:response[x].agent,
                    userType:response[x].userType,
                    producer:response[x].producer,
                    //lob
                    category_name:response[x].category_name,
                    //carrier
                    company_name:response[x].company_name

                });
             }
              await ImportData.insertMany(userData);
             
        });
        
          res.send({status:200,success:true,msg:"CSV Imported"})
    }catch(error){
        res.send({status:400,success:false,msg:error.message})

    }
}


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length > 0) return true;
    return false;
};

const isValidRequest = function (object) {
    return Object.keys(object).length > 0
}

const isValidEmail = function (value) {
    const regexForEmail = /^[a-z0-9_]{3,}@[a-z]{3,}.[a-z]{3,6}$/
    return regexForEmail.test(value)
}


const regixValidator = function (value) {
    const regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/
    return regex.test(value)
}

let timeElapsed = Date.now();
let today = new Date(timeElapsed);

//__________________________________create user_______________________________________

//[REGISTER NEW USER]

const createUser = async function (req, res) {

    try {
        let data = req.body
          //console.log(data)
        if (!isValidRequest(data)) {
            return res
                .status(400)
                .send({ status: false, message: "user data is required" });
        }
        //using desturcturing
        const { firstname, dob, zip, email, phone, address, state, city } = data;

        //data should not have more than 8 keys as per outherSchema (edge case)
        if (Object.keys(data).length > 8) {
            return res.
                  status(400).
                  send({ status: false, message: "Invalid data entry inside request body" })
        }

        if (!isValid(firstname) || !regixValidator(firstname)) {
            return res
                .status(400)
                .send({ status: false, message: "first name is required or its should contain character" })
        }

        if (!isValid(dob)) {
            return res
                .status(400)
                .send({ status: false, message: "dob is required" })
        }

        if (!isValid(zip)) {
            return res
                .status(400)
                .send({ status: false, message: "zip is required" })
        }

        if (!isValid(email)) {
            return res
                .status(400)
                .send({ status: false, message: "email is required" })
        }

        if (!isValidEmail(email)) {
            return res
                .status(400)
                .send({ status: false, message: "Enter a valid email address" })
        }

        if (!isValid(phone)) {
            return res
                .status(400)
                .send({ status: false, message: "phone is required" })
        }


        if (!isValid(address) || !regixValidator(address)) {
            return res
                .status(400)
                .send({ status: false, message: "address is required or its should contain character" })
        }

        if (!isValid(state) || !regixValidator(state)) {
            return res
                .status(400)
                .send({ status: false, message: "state is required or its should contain character" })
        }
       
        if (!isValid(city) || !regixValidator(city)) {
            return res
                .status(400)
                .send({ status: false, message: "city is required or its should contain character" })
        }

        const isEmailUnique = await userModel.findOne({ email: email })

        if (isEmailUnique) {
            return res
                .status(400)
                .send({ status: false, message: "Email already exits" });
        }

        const newUser = await userModel.create(data);
        return res
            .status(201)
            .send({ status: true, message: "user registered successfully", data: newUser });

    } catch (err) {
        res.status(500).send({ err: err.message })

    }
}

// GET USERS
const getUsers = async function (req, res) {
    try {
        
        let findUsers = await userModel.find()
       
        res.status(200).send({ status: true, message: "users list", data: findUsers })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//UPDATE USERS
const updateUsers = async function (req, res) {

    try {
        requestBody = req.body
        requestQuery = req.query
        userId = req.params.userId

        if (Object.keys(requestQuery).length > 0) return res.status(400).send({ status: false, message: "Please input the data in requestBody only" })
        if (Object.keys(requestBody).length == 0) return res.status(400).send({ status: false, message: "Please input the details for updation" })

        let findUser = await userModel.findOne({ _id: userId })
        if (!findUser) return res.status(404).send({ status: false, message: "No user found with this userId" })
        if (findUser.isDeleted == true) return res.status(409).send({ status: false, message: "The user is already deleted , it can't be updated" })

        let { firstname, dob, zip, email, phone, address, state, city } = requestBody // Destructuring

        let updateUser = await userModel.findOneAndUpdate({ _id: userId }, { $set: { firstname:firstname, dob:dob, zip:zip, email:email, phone:phone,address:address,state:state,city:city } }, { new: true })

        res.status(200).send({ status: true, message: "Sucessfully updated", data: updateUser });  

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

// DELETE USER
const deleteUser = async function (req, res) {
    try {
        let requestParams = req.params
        userId = requestParams.userId

        let findUser = await userModel.findById(userId)
        if (!findUser) return res.status(404).send({ status: false, message: "No user found with given userId" })

        if (findUser.isDeleted) return res.status(200).send({ status: true, message: "user already deleted" })
   
        await userModel.updateOne((findUser), { $set: { isDeleted: true, deletedAt: today } })
        return res.status(200).send({ status: true, message: "successfully deleted" })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
module.exports={ importUser, createUser, getUsers, updateUsers, deleteUser}