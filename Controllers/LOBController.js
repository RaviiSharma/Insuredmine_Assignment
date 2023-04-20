var lobModel = require("../Models/LOB");
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

 //__________________________________create LOB__________

//[REGISTER NEW LOB]

const createLOb = async function (req, res) {

    try {
        let data = req.body
          //console.log(data)
        if (!isValidRequest(data)) {
            return res
                .status(400)
                .send({ status: false, message: "LOB data is required" });
        }
        //using desturcturing
        const { category_name } = data;
      
        //data should not have more than 1 keys as per outherSchema (edge case)
        if (Object.keys(data).length >1 ) {
            return res.
                  status(400).
                  send({ status: false, message: "Invalid data entry inside request body" })
        }


        if (!isValid(category_name) || !regixValidator(category_name)) {
            return res
                .status(400)
                .send({ status: false, message: "category_name is required or its should contain charcters" })
        }
       
        const newLob = await lobModel.create(data);
        return res
            .status(201)
            .send({ status: true, message: "LOB registered successfully", data: newLob });

    } catch (err) {
        res.status(500).send({ err: err.message })

    }
}

module.exports={ createLOb}