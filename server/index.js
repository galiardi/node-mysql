import http from 'http';
import express from 'express';
import { PORT } from './config.js';
import router from './routes/index.routes.js';

const app = express();

app.use(express.json());
app.use(router);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
