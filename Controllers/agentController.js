var agentModel = require("../Models/Agent");



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


//__________________________________create agent__________


//[REGISTER NEW AGENT]

const createAgent = async function (req, res) {

    try {
        let data = req.body
          //console.log(data)
        if (!isValidRequest(data)) {
            return res
                .status(400)
                .send({ status: false, message: "agent data is required" });
        }
        //using desturcturing
        const { agent, userType, producer } = data;
      
        //data should not have more than 3 keys as per outherSchema (edge case)
        if (Object.keys(data).length >3) {
            return res.
                  status(400).
                  send({ status: false, message: "Invalid data entry inside request body" })
        }


        if (!isValid(agent) || !regixValidator(agent)) {
            return res
                .status(400)
                .send({ status: false, message: "agent is required or its should contain charcters" })
        }
       
        if (!isValid(userType) || !regixValidator(userType)) {
            return res
                .status(400)
                .send({ status: false, message: "userType is required or its should contain character" })
        }

        if (!isValid(producer) || !regixValidator(producer)) {
            return res
                .status(400)
                .send({ status: false, message: "producer is required or its should contain character" })
        }
        
        
        const newAgent = await agentModel.create(data);
        return res
            .status(201)
            .send({ status: true, message: "policy registered successfully", data: newAgent });

    } catch (err) {
        res.status(500).send({ err: err.message })

    }
}

module.exports={ createAgent}