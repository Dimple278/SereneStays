import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

const config = {
  map_access_token: process.env.MAPBOX_ACCESS_TOKEN,
};

export default config;
