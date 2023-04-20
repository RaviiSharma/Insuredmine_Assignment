var accountModel= require("../Models/Account");


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length > 0) return true;
    return false;
};

const isValidRequest = function (object) {
    return Object.keys(object).length > 0
}

const regixValidator = function (value) {
    const regex = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/
    return regex.test(value)
}

let timeElapsed = Date.now();
let today = new Date(timeElapsed);

//__________________________________create account____________________

const createAccount = async function (req, res) {

    try {
        let data = req.body
          //console.log(data)
        if (!isValidRequest(data)) {
            return res
                .status(400)
                .send({ status: false, message: "account data is required" });
        }
        //using desturcturing
        const { account_name, account_type, permium_amount, permium_amount_written } = data;
    
        //data should not have more than 4 keys as per outherSchema (edge case)
        if (Object.keys(data).length > 4) {
            return res.
                  status(400).
                  send({ status: false, message: "Invalid data entry inside request body" })
        }

        if (!isValid(account_name) || !regixValidator(account_name)) {
            return res
                .status(400)
                .send({ status: false, message: "account_name is required or its should contain character" })
        }

        if (!isValid(account_type) || !regixValidator(account_type)) {
            return res
                .status(400)
                .send({ status: false, message: "account_type is required or its should contain character" })
        }
       
        if (!isValid(permium_amount)) {
            return res
                .status(400)
                .send({ status: false, message: "permium_amount is required or its should contain character" })
        }
        if (!isValid(permium_amount_written) || !regixValidator(permium_amount_written)) {
            return res
                .status(400)
                .send({ status: false, message: "permium_amount_written is required or its should contain character" })
        }

        const newAcoount = await accountModel.create(data);
        return res
            .status(201)
            .send({ status: true, message: "account registered successfully", data: newAcoount });

    } catch (err) {
        res.status(500).send({ err: err.message })

    }
}

// GET USERS
const getAccount = async function (req, res) {
    try {
        
        let findAccount = await accountModel.find()
       
        res.status(200).send({ status: true, message: "users list", data:findAccount})
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//UPDATE USERS
const updateAccount = async function (req, res) {

    try {
        requestBody = req.body
        requestQuery = req.query
        accountId = req.params.accountId

        if (Object.keys(requestQuery).length > 0) return res.status(400).send({ status: false, message: "Please input the data in requestBody only" })
        if (Object.keys(requestBody).length == 0) return res.status(400).send({ status: false, message: "Please input the details for updation" })

        let findAccount = await accountModel.findOne({ _id:  accountId})
        if (!findAccount) return res.status(404).send({ status: false, message: "No account found with this accountId" })
        if (findAccount.isDeleted == true) return res.status(409).send({ status: false, message: "The account is already deleted , it can't be updated" })

        let {account_name, account_type, permium_amount, permium_amount_written} = requestBody // Destructuring

        let updateAccount = await accountModel.findOneAndUpdate({ _id: accountId }, { $set: { account_name:account_name, account_type:account_type, permium_amount:permium_amount, permium_amount_written:permium_amount_written } }, { new: true })

        res.status(200).send({ status: true, message: "Sucessfully updated", data: updateAccount });  //account_name, account_type, permium_amount, permium_amount_written

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

//DELETE USER
const deleteAccount = async function (req, res) {
    try {
        let requestParams = req.params
        accountId = requestParams.accountId

        let findAccount = await accountModel.findById(accountId)
        if (!findAccount) return res.status(404).send({ status: false, message: "No account found with given accountId" })

        if (findAccount.isDeleted) return res.status(200).send({ status: true, message: "account already deleted" })
   
        await accountModel.updateOne((findAccount), { $set: { isDeleted: true, deletedAt: today } })
        return res.status(200).send({ status: true, message: "successfully deleted" })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports={ createAccount, getAccount, updateAccount,deleteAccount }