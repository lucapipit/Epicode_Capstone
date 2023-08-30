const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization").split(" ")[1].split('"')[1];
    console.log(token, "sono nel verifyToken");
    if(!token){
        return res.status(401).send({
            errorType: "token non presente",
            statusCode: 401,
            message: "problemi col token"
        });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).send({
            statusCode: 403,
            message: "autenticazione non riuscita",
            errorType: "token error"
        })
    }
}

module.exports = verifyToken;