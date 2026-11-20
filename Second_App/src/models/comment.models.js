import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";
import sequelizePaginate from "sequelize-paginate"; //use for pagination for videos

const Comment = sequelize.define(
  "comments",
  {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "videos",
        key: "id",
      },
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "comments",
    timestamps: true,
  }
);
sequelizePaginate.paginate(comment);

export default Comment;
