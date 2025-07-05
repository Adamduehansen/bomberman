import { App, fsRoutes, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import { socket } from "./middleware/socket-middleware.ts";
import { httpLogger } from "./middleware/http-logger-middleware.ts";

export const app = new App<State>();

app.use(staticFiles());

app.use(httpLogger);
app.get("/ws", socket);

await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
