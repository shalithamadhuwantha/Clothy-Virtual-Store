const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const dbConfig = require("../config/db");

// Change these values as needed
const adminData = {
  name: { en: "Admin" },
  email: "admin@example.com",
  password: bcrypt.hashSync("12345678", 10),
  role: "Admin",
  status: "Active",
  image: "",
  address: "",
  country: "",
  city: "",
  phone: "",
  access_list: [],
  joiningData: new Date(),
};

async function createAdmin() {
  try {
    await mongoose.connect(dbConfig.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const existing = await Admin.findOne({ email: adminData.email });
    if (existing) {
      console.log("Admin already exists.");
    } else {
      await Admin.create(adminData);
      console.log("Admin user created successfully.");
    }
    mongoose.connection.close();
  } catch (err) {
    console.error("Error creating admin:", err);
    mongoose.connection.close();
  }
}

createAdmin();
