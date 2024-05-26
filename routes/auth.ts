// Import packages
import { Router } from 'express';
import { upload } from '../helpers/upload';
import { changePassword, getUser, login, register, sendOtp, updateUser, verifyOtp } from '../controllers/auth';


const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE.


routes.post('/v1/login', login);
routes.post('/v1/update', upload.array("image"), updateUser);
routes.post('/v1/register', register);
routes.post('/v1/forget', changePassword)
routes.post('/v1/verify', verifyOtp)
routes.post('/v1/send-otp', sendOtp);
routes.get('/v1/user', getUser);


export default routes;
