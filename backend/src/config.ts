import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

const config = {
  port: process.env.PORT,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || "1d",
    refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION || "7d",
  },
  database: {
    client: process.env.DB_CLIENT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
};

export default config;
