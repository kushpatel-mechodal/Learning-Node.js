import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const Playlist = sequelize.define(
  "playlists",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videos: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    //   references: {
    //     model: "videos",
    //     key: "id",
    //   },
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
    tableName: "playlists",
    timestamps: true,
  }
);

export default Playlist;
