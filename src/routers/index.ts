import express from 'express';
import ping from 'src/controllers/ping';
import reports from "./reports";

const router = express.Router();

router.get('/ping', ping);

router.use('/reports', reports);

export default router;
