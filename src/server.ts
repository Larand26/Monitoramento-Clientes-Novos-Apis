import appConfig from "./config/app.config.js";

import App from "./App.js";

const app = new App().server;

async function startServer() {
  const port = appConfig.api.port;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
