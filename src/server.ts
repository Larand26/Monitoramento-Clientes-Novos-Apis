import appConfig from "./config/app.config.js";

import App from "./App.js";

import { logger } from "./utils/logger.js";

const app = new App().server;

async function startServer() {
  const port = appConfig.api.port;
  app.listen(port, () => {
    logger.success(`Server is running on port ${port}`);
  });
}

startServer();
