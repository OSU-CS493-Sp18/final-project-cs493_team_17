
db.createUser({user: "mongouser",pwd: "hunter2",roles: [ { role: "readWrite", db: "mongodb" } ]});
db.users.insertOne({userID: "duke",username: "dukeSkywalker",age: 21,email: "dukeTheJedi@gmail.com", password: "abc123"});
db.users.insertOne({userID: "luke",username: "luke kywalker",age: 24,email: "Luke-TheJedi@gmail.com", password: "abcdef"});
