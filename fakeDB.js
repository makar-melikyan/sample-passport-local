
const fakeDB = {
  users: [
    {
      username: "johnsmith",
      password: "123",
      firstname: "John",
      lastname: "Smith",
      email: "john@example.com",
      hobby: "Waisting time on sample apps.",
      id: "001"
    },
    {
      username: "poghos",
      password: "",
      firstname: "Poghos",
      lastname: "Petrosyan",
      email: "poghos@example.com",
      hobby: "Learning Node.js.",
      id: "002"
    },
    {
      username: "johnsmith2",
      password: "123",
      firstname: "John",
      lastname: "Smith",
      email: "smith2@example.com",
      hobby: "I am a fake",
      id: "003"
    },
    {
      username: "petros",
      password: "123",
      firstname: "Petros",
      lastname: "Martirosyan",
      email: "petros@example.com",
      hobby: "I am a fake, too",
      id: "004"
    },
  ],

  findByUsername: function (input, callback) {
    const foundUser = this.users.find(function (elm) { return elm.username === input });
    foundUser ? callback(null, foundUser) : callback(null, false);
  },
  findByID: function (input, callback) {
    const foundUser = this.users.find(function (elm) { return elm.id === input });
    foundUser ? callback(null, foundUser) : callback(null, false);
  }
}

module.exports = fakeDB;