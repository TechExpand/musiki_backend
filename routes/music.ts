// Import packages
import { Router } from 'express';
import { upload } from '../helpers/upload';
import { changePassword, getUser, login, register, sendOtp, updateUser, verifyOtp } from '../controllers/auth';
import { createArtist } from '../controllers/artist';
import { checkMusicInfo, createMusic } from '../controllers/music';


const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE.


routes.post('/v1/music', upload.single("file"), createMusic);
routes.post('/v1/music/info', upload.single("file"), checkMusicInfo);



export default routes;
