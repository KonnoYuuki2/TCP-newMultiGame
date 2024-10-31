import net from "net";
import { onConnection } from "./events/onConnection.js";
import initServer from "./init/index.js";
import { config } from "./config/config.js";

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.PORT, config.server.HOST, (socket) => {
      console.log(
        `${config.server.HOST}:${config.server.PORT}로 서버가 열렸습니다.`
      );
    });
  })
  .catch((error) => {
    console.error(0);
    process.exit(1);
  });
