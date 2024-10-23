module.exports = {
  mongoDB_URL:
    process.env.mongoDB_URL || "mongodb://localhost:27017/student-db",
  session_Secret:
    process.env.session_Secret ||
    "88cfe365f2d611d427717ebfea7b6a760627de87f6d0286a7bf2291655e1982d",
  port: process.env.PORT || 5000,
};
