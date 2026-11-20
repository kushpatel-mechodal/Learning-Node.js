import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const Tweet = sequelize.define(
  "Tweets",
  {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "Tweets",
    timestamps: true,
  }
);

export default Tweet;
