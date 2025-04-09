import { CREATED, OK } from "../constants/statusCode";
import { createReport, getAllReport, getAllReportById } from "../services/lab.service";
import catchErrors from "../utils/catchErrors";

export const createReportHandler = catchErrors(async (req, res) => {
  // get payload from body
  const request = req.body;

  //create  report
  const { createdReport } = await createReport(request);

  return res.status(CREATED).json(createdReport);
});

export const getAllLabReportHandler = catchErrors(async (req, res) => {
  //create  report
  const { allReport } = await getAllReport();

  return res.status(OK).json(allReport);
});

export const getAllReportByIdHandleer = catchErrors(async (req, res) => {
  // get payload from body
  const {id:reportId} = req.params;

  //create  report
  const { report } = await getAllReportById(reportId);

  return res.status(OK).json(report[0]);
});
