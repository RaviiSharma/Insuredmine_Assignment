var policyModel= require("../Models/Policy");


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

const isValidNumber = function (value) {
    if (typeof (value) === "undefined" || value === null) return false;
    if (typeof (value) === "string" && value.trim().length > 0 && Number(value) !== NaN && Number(value) >= 0) return true
    if (typeof (value) === "number" && value >= 0) return true;
    return false;
};

let timeElapsed = Date.now();
let today = new Date(timeElapsed);


//__________________________________create policy_______________________________________

//[REGISTER NEW POLICY]

const createPolicy = async function (req, res) {

    try {
        let data = req.body
          //console.log(data)
        if (!isValidRequest(data)) {
            return res
                .status(400)
                .send({ status: false, message: "policy data is required" });
        }
        //using desturcturing
        const { policy_mode, policy_number, policy_type, policy_start_date, policy_end_date } = data;
       
        //data should not have more than 5 keys as per outherSchema (edge case)
        if (Object.keys(data).length > 5) {
            return res.
                  status(400).
                  send({ status: false, message: "Invalid data entry inside request body" })
        }

        if (!isValid(policy_mode) || !isValidNumber(policy_mode)) {
            return res
                .status(400)
                .send({ status: false, message: "policy_mode is required or its should contains number" })
        }

        if (!isValid(policy_number) || !regixValidator(policy_number)) {
            return res
                .status(400)
                .send({ status: false, message: "policy_number is required or its should contain number" })
        }
       
        if (!isValid(policy_type) || !regixValidator(policy_type)) {
            return res
                .status(400)
                .send({ status: false, message: "policy_type is required or its should contain character" })
        }
        if (!isValid(policy_start_date)) {
            return res
                .status(400)
                .send({ status: false, message: "policy_start_date is required or its should contain character" })
        }
        if (!isValid(policy_end_date)) {
            return res
                .status(400)
                .send({ status: false, message: "policy_start_date is required or its should contain character" })
        }

        const newPolicy = await policyModel.create(data);
        return res
            .status(201)
            .send({ status: true, message: "policy registered successfully", data: newPolicy });

    } catch (err) {
        res.status(500).send({ err: err.message })

    }
}

// GET USERS
const getPolicy = async function (req, res) {
    try {
        
        let findPolicy = await policyModel.find()
       
        res.status(200).send({ status: true, message: "users list", data:findPolicy})
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//UPDATE USERS
const updatePolicy = async function (req, res) {

    try {
        requestBody = req.body
        requestQuery = req.query
        policyId = req.params.policyId

        if (Object.keys(requestQuery).length > 0) return res.status(400).send({ status: false, message: "Please input the data in requestBody only" })
        if (Object.keys(requestBody).length == 0) return res.status(400).send({ status: false, message: "Please input the details for updation" })

        let findPolicy = await policyModel.findOne({ _id:  policyId})
        if (!findPolicy) return res.status(404).send({ status: false, message: "No policy found with this policyId" })
        if (findPolicy.isDeleted == true) return res.status(409).send({ status: false, message: "The policy is already deleted , it can't be updated" })

        let {policy_mode, policy_number, policy_type, policy_start_date, policy_end_date} = requestBody // Destructuring

        let updatePolicy = await policyModel.findOneAndUpdate({ _id: policyId }, { $set: { policy_mode:policy_mode, policy_number:policy_number, policy_type:policy_type, policy_start_date:policy_start_date, policy_end_date:policy_end_date } }, { new: true })

        res.status(200).send({ status: true, message: "Sucessfully updated", data: updatePolicy }); 

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

//DELETE POLICY

const deletePolicy = async function (req, res) {
    try {
        let requestParams = req.params
        policyId = requestParams.policyId

        let findPolicy = await policyModel.findById(policyId)
        if (!findPolicy) return res.status(404).send({ status: false, message: "No policy found with given policyId" })

        if (findPolicy.isDeleted) return res.status(200).send({ status: true, message: "policy already deleted" })
   
        await policyModel.updateOne((findPolicy), { $set: { isDeleted: true, deletedAt: today } })
        return res.status(200).send({ status: true, message: "successfully deleted" })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports={ createPolicy, getPolicy, updatePolicy,deletePolicy }