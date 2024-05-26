// Import packages
import { Router } from 'express';
import { upload } from '../helpers/upload';
import { changePassword, getUser, login, register, sendOtp, updateUser, verifyOtp } from '../controllers/auth';
import { createArtist } from '../controllers/artist';
import { checkMusicInfo, createMusic } from '../controllers/music';
import { addSongtoPlaylist, createPlaylist, fetchPlaylist, fetchPlaylistMusic } from '../controllers/playlist';


const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE.

routes.get('/v1/playlist', fetchPlaylist);
routes.get('/v1/playlist/music', fetchPlaylistMusic);
routes.post('/v1/playlist', upload.single("file"), createPlaylist);
routes.post('/v1/playlist/music', addSongtoPlaylist);




export default routes;
