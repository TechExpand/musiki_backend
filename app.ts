import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/configSetup';

import { initDB } from './controllers/db';
import artist from './routes/artist';
import music from './routes/music';
import playlist from './routes/playlist';
import auth from './routes/auth';
import { isAuthorized } from './middlewares/authorise';
import { request } from 'http';
import { Redis } from './services/redis';

const app: Application = express();

const http = require('http').Server(app);



app.use(morgan('dev'));

// PARSE JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ENABLE CORS AND START SERVER
app.use(cors({ origin: true }));
initDB();

http.listen(config.PORT, () => {
	console.log(`Server started on port ${config.PORT}`);
});


// set the view engine to ejs
app.set('view engine', 'ejs');


app.use(express.static(__dirname + '/public'));

// use res.render to load up an ejs view file

app.all('*', isAuthorized);
app.use("/api", auth);
app.use("/api", playlist)
app.use("/api", artist);
app.use("/api", music);








