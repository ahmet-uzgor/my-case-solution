const usersList = [
    {_id: '12345', username: 'test', password:'$2a$10$ziYuCIcF1Y0FxtYfOduNEebCKymncla/cJitGQIs9SHxbMb94HcDW' }
];

const { v4: uuidv4 } = require('uuid');


function createUser(name, pass){
    return new Promise((resolve, reject) => {
        usersList.push({ _id: uuidv4(), username: name, password: pass })
        resolve(usersList[usersList.length-1])
    })
};

function findByUsername( name ) {
    const userFound = usersList.find(user => user.username == name)
    return userFound;
}

module.exports = { createUser, findByUsername}