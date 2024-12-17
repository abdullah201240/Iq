import express from 'express';
const router = express.Router();
import authRoute from './auth'
import adminRoute from './adminRoute';
import userRoute from './userRoute';


router.use('/admin/auth', authRoute);
router.use('/admin', adminRoute);
router.use('/user', userRoute);


export default router;
