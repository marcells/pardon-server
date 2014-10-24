var users = [
    { userName: 'a', password: 'a' },
    { userName: 'a1', password: 'a' },
    { userName: 'a2', password: 'a' },
];

exports.findOne = function (userName, callback) {
    var foundUsers = users.filter(function (user) {
        return user.userName === userName;
    });

    if (foundUsers.length === 1) {
        callback(null, foundUsers[0]);
    } else {
        callback (null, null);
    }
};

exports.validPassword = function (user, password) {
    return user.password === password;
};