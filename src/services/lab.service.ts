import LabReportModel from "../models/lab.model";

export const createReport = async (data: any) => {
  // console.log("payalod ==>",JSON.stringify(data,null,3))
  const createdReport = await LabReportModel.create(data);

  return {
    createdReport,
  };
};

export const getAllReport = async () => {
  // console.log("payalod ==>",JSON.stringify(data,null,3))
  const allReport = await LabReportModel.find({})
    .populate({
      path: "patient",
      select: ["profile", "email","role"],
    })
    .populate({ path: "performedBy", select: ["profile", "email",'role'] })
    .sort({ createdAt: -1 });

  return {
    allReport,
  };
};

export const getReportById = async (reportId: string) => {
  // console.log("payalod ==>",JSON.stringify(data,null,3))
  const report = await LabReportModel.find({ _id: reportId }).populate({
    path: "patient",
    select: ["profile", "email","role"],
  })
  .populate({ path: "performedBy", select: ["profile", "email",'role'] });

  return {
    report,
  };
};
