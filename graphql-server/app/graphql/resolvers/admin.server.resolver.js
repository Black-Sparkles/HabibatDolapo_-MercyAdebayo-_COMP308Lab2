const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");

const adminResolver = {
  Query: {
    async loginAdmin(_, { adminEmail, password }) {
      const admin = await Admin.findOne({ adminEmail });
      if (!admin || !bcrypt.compareSync(password, admin.password)) {
        throw new Error("Invalid credentials");
      }
      return jwt.sign(
        { id: admin._id, adminEmail: admin.adminEmail },
        process.env.SESSION_SECRET,
        { expiresIn: "1h" }
      );
    },
    async getAllAdmins() {
      return await Admin.find(); // Fetch all admins from the database
    },
  },
  Mutation: {
    async createAdmin(_, { adminEmail, password }) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const admin = new Admin({ adminEmail, password: hashedPassword });
      return await admin.save();
    },
  },
};

module.exports = adminResolver;
