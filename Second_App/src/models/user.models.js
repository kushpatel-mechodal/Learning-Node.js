import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const user = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING, //cloudinary url
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.STRING, //cloudinary url
    },
    watchHistory: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [], //if no value then array is empty
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    //use indexes for searching data
    indexes: [
      {
        fields: ["username"],
      },
    ],
  }
);

//use beforesave sequelize hook for help to password hash
user.beforeSave(async function (newuser) {
  if (newuser.changed("password")) {
    //bcrypt.hash is hashed password
    newuser.password = await bcrypt.hash(newuser.password, 10);
  }
});

// use custom method for the check password if correct or not, use prototype for custom method
user.prototype.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

user.prototype.generateAccessToken = async function () {
  return await jwt.sign(
    {
      id: this.id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

user.prototype.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export default user;
