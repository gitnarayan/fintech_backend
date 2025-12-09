import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/config.js";
import logger from "./config/logger.js";


let server; // Declare a single server instance

mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info("✅ Connected to MongoDB");
    server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    logger.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
 
});
