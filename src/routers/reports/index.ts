import express from "express";
import {getReportCountsByBookId, getReportsByBookId, saveReport} from "../../controllers/reports";

const router = express.Router();

router.post('', saveReport);
router.get('', getReportsByBookId);
router.get('/statistics', getReportCountsByBookId);

export default router;