import { Router } from "express";
import { createReportHandler, getAllLabReportHandler, getAllReportByIdHandleer } from "../controllers/lab.controller";


const labRoutes = Router();

// prefix: /labReport

//get all lab report 
labRoutes.get("/", getAllLabReportHandler);

//get lab report by ID
labRoutes.get("/:id", getAllReportByIdHandleer);


labRoutes.post("/create-report", createReportHandler);


export default labRoutes;