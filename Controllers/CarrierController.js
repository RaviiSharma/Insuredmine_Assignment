var carrierModel = require("../Models/Carrier");
const mongoose = require("mongoose");



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

//__________________________________create carrier_________

//[REGISTER NEW CARRIER]

const createCarrier = async function (req, res) {

    try {
        let data = req.body
          //console.log(data)
        if (!isValidRequest(data)) {
            return res
                .status(400)
                .send({ status: false, message: "carrier data is required" });
        }
        //using desturcturing
        const { company_name } = data;
      
        //data should not have more than 1 keys as per outhorSchema (edge case)
        if (Object.keys(data).length >1 ) {
            return res.
                  status(400).
                  send({ status: false, message: "Invalid data entry inside request body" })
        }


        if (!isValid(company_name) || !regixValidator(company_name)) {
            return res
                .status(400)
                .send({ status: false, message: " company_name is required or its should contain charcters" })
        }
       
        
    
        const newCarrier = await carrierModel.create(data);
        return res
            .status(201)
            .send({ status: true, message: "carrier registered successfully", data: newCarrier });

    } catch (err) {
        res.status(500).send({ err: err.message })

    }
}

module.exports={ createCarrier}