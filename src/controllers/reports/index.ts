import {Request, Response} from "express";
import {ReportSaveDto} from "../../dto/report/reportSaveDto";
import {createReport, getReportCountsByBookIdService, getReportsByBookIdService} from "../../services/report";
import httpStatus from "http-status";
import {InternalError} from "../../system/internalError";
import log4js from "log4js";
import {ReportQueryDto} from "../../dto/report/reportQueryDto";
import {ReportArrayDto} from "../../dto/report/reportArrayDto";

export const saveReport = async (req: Request, res: Response) => {
  try {
    const report = new ReportSaveDto(req.body);
    const id = await createReport({
      ...report,
    });
    res.status(httpStatus.CREATED).send({
      id,
    });
  }
  catch (err) {
    const { message, status } = new InternalError(err);
    log4js.getLogger().error('Error in creating report.', err);
    res.status(status).send({ message });
  }
};

export const getReportsByBookId = async (req: Request, res: Response)=> {
  try {
    const body = req.body;
    const reportQueryDto = new ReportQueryDto(body);
    const reports = await getReportsByBookIdService({...reportQueryDto});
    res.status(httpStatus.CREATED).send({
      reports,
    });
  }
  catch (err) {
    const { message, status } = new InternalError(err);
    log4js.getLogger().error('Error in getting report.', err);
    res.status(status).send({ message });
  }
};

export const getReportCountsByBookId = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const reportArrayDto = new ReportArrayDto(body);
    const ids = await getReportCountsByBookIdService({...reportArrayDto});
    res.status(httpStatus.OK).send(ids);
  } catch (err) {
    const { message, status } = new InternalError(err);
    log4js.getLogger().error('Error in getting statistics by reports.', err);
    res.status(status).send({ message });
  }
};
