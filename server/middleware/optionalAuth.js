const checkUser = require('jsonwebtoken');
const Admin = require('../models/Admin');

const optionalAuth = async (req, res, next) => {
    let token;
    if (req.cookies && req.cookies.token) token = req.cookies.token;
    if (token && token !== 'none') {
        try {
            const decoded = checkUser.verify(token, process.env.JWT_SECRET);
            req.user = await Admin.findById(decoded.id);
        } catch (e) {}
    }
    next();
};

module.exports = optionalAuth;
