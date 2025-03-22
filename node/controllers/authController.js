const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleLogin = async (request, response) => {
    const { user, pwd } = request.body;
    if (!user || !pwd) return response.status(400).json({ 'message': 'Username and password are required.'});

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return response.sendStatus(401); // unauthorized

    // evaluate password if found user
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // create JWTs
        // response.json({ 'success': `User ${user} is logged in!`});
    } else {
        response.sendStatus(401); // unauthorized
    }
}

module.exports = { handleLogin };