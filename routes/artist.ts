// Import packages
import { Router } from 'express';
import { upload } from '../helpers/upload';
import { changePassword, getUser, login, register, sendOtp, updateUser, verifyOtp } from '../controllers/auth';
import { createAlbum, createArtist, fetchArtist, fetchArtistMusic, fetchArtistMusicById } from '../controllers/artist';


const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE.


routes.post('/v1/artist', createArtist);
routes.get('/v1/artist', fetchArtist);
routes.post('/v1/artist/album', createAlbum);
routes.get('/v1/artist/music', fetchArtistMusic);
routes.get('/v1/artist/musicbyid', fetchArtistMusicById);





// routes.post('/v1/update', upload.array("image"), updateUser);
// routes.post('/v1/register', register);
// routes.post('/v1/forget', changePassword)
// routes.post('/v1/verify', verifyOtp)
// routes.post('/v1/send-otp', sendOtp);
// routes.get('/v1/user', getUser);


export default routes;
