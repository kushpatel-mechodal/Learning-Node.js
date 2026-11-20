import { DataTypes, TableHints } from "sequelize";
import { sequelize } from "../db/db.js";

const Like = sequelize.define(
  "likes",
  {
    video: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "videos",
        key: "id",
      },
    },
    comment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "comments",
        key: "id",
      },
    },
    likedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    tweet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tweets",
        key: "id",
      },
    },
  },
  {
    tableName: "likes",
    timestamps: true,
  }
);

export default Like; 