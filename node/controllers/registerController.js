const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (request, response) => {
    const { user, pwd } = request.body;
    if (!user || !pwd) return response.status(400).json({ 'message': 'Username and password are required.'});

    // check for duplicate usernames in the database
    const duplicate = usersDB.users.find(person => person.username === user);
    if (duplicate) return response.sendStatus(409);  // conflict status code

    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // store the new user
        const newUser = { "username": user, "password": hashedPwd };
        usersDB.setUsers([...usersDB.users, newUser]);
        // write the database (json file)
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        response.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        response.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };