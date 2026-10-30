import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const video = sequelize.define(
  "Video",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoFile: {
      type: DataTypes.STRING, //cloudinary url
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING, //cloudinary url
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isPublished: {
      type: DataTypes.BOOLEAN, //either value true or false
      defaultValue: true,
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", //database table name
        key: "id", //user id reference
      },
    },
  },
  {
    tableName: "videos",
    timestamps: true,
  }
);

export default video;
