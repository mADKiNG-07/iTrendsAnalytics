const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    // gets the token from the requests
    const token = req.header('x-auth-token');

    // checks if the token was provided
    if (!token) return res.status(401)
        .send("Access Denied! No Token Provided!");

    try {
        // verifies the token (decodes the token)
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;

        // checks if the user is authorized(isAdmin)
        if (!req.user.isAdmin) return res.status(404)
            .send("Access Denied");

        next();
    }
    catch (err) {
        res.status(400).send('Invalid Token');
    }
}

