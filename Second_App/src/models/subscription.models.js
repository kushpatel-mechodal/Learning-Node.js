import { DataTypes } from "sequelize";
import { sequelize } from "../db/db";

const subscription = sequelize.define(
  "Subscription",
  {
    subscriber: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    channel: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "subscription",
    timestamps: true,
  }
);

export default subscription;
