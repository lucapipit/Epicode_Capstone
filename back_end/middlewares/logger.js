const logger = (req, res, next) => {
    const { method, url, ip } = req;

    //example
    if(method === "PATCH" && url === "/exapmle"){
        return;//esempio di come escludere un middleware globale
    }
    //

    console.log(`[${new Date().toISOString()}] Effettuata richiesta ${method} all'endpoint ${url} dall'ip ${ip} --- middleware logger.js`);
    next();
};

module.exports = logger;