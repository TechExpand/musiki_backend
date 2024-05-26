// Import packages
import { Sequelize } from 'sequelize-typescript';

// Import configs
import config from '../config/configSetup';
import { Users } from '../models/Users';
import { Artist } from '../models/Artist';
import { Verify } from '../models/Verify';
import { Recent } from '../models/Recent';
import { Playlist } from '../models/Playlist';
import { Music } from '../models/Music';
import { MusicAlbum } from '../models/Albulm';
import { MusicPlaylist } from '../models/MusicPlaylist';




const sequelize = new Sequelize(config.DBNAME, config.DBUSERNAME, config.DBPASSWORD, {
	host: config.DBHOST,
	port: config.DBPORT,
	dialect: 'mysql',
	logging: false,
	// dialectOptions: {
	// 	ssl: { require: true, rejectUnauthorized: false },
	// },
	ssl: false,
	models: [
		Users,
		Artist,
		Verify,
		Recent,
		Playlist,
		Music,
		MusicAlbum,
		MusicPlaylist,
		
		
	],
});

const initDB = async () => {
	await sequelize.authenticate();
	await sequelize
		.sync({ alter: true })
		.then(async () => {
			console.log('Database connected!');
		})
		.catch(function (err: any) {
			console.log(err, 'Something went wrong with the Database Update!');
		});
};
export { sequelize, initDB };
