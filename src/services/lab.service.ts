import LabReportModel from "../models/lab.model";


export const createReport = async (data:any) => {
// console.log("payalod ==>",JSON.stringify(data,null,3))
  const createdReport = await LabReportModel.create(data);

  return {
    createdReport
  };
};


export const getAllReport = async () => {
// console.log("payalod ==>",JSON.stringify(data,null,3))
  const allReport = await LabReportModel.find();

  return {
    allReport
  };
};


export const getAllReportById = async (reportId:string) => {
// console.log("payalod ==>",JSON.stringify(data,null,3))
  const report = await LabReportModel.find({_id:reportId});

  return {
    report
  };
};
