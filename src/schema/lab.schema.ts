import { z } from "zod";
import mongoose from "mongoose";
import { labScientistProfileSchema, patientProfileSchema } from "./auth.schema";

const SampleValidationSchema = z.object({


  sampleType: z.enum(["Blood", "Urine", "Stool", "CSF", "Others"], {
    message: "Sample type must be one of: Blood, Urine, Stool, CSF, or Others",
  }),
  clinicalIndication: z.string().optional(),
  otherSampleSpecification: z.string().optional(),
});

const HematologyValidationSchema = z.object({
  hemoglobin: z.object({
    requested: z.boolean(),
    value: z
      .number()
      .optional()
      .refine((val) => !val || (val >= 1 && val <= 25), {
        message: "Hemoglobin must be between 1 and 25 g/dL",
      }),
    reference: z.object({
      min: z.number(),
      max: z.number(),
      unit: z.string(),
    }),
  }),
  wbcCount: z.object({
    requested: z.boolean(),
    value: z
      .number()
      .optional()
      .refine((val) => !val || (val >= 1000 && val <= 50000), {
        message: "WBC count must be between 1,000 and 50,000 /mm³",
      }),
    reference: z.object({
      min: z.number(),
      max: z.number(),
      unit: z.string(),
    }),
  }),
  differentialCount: z.object({
    requested: z.boolean(),
    neutrophils: z.object({
      value: z
        .number()
        .optional()
        .refine((val) => !val || (val >= 0 && val <= 100), {
          message: "Neutrophils percentage must be between 0 and 100%",
        }),
      reference: z.object({
        min: z.number(),
        max: z.number(),
        unit: z.string(),
      }),
    }),
    lymphocytes: z.object({
      value: z
        .number()
        .optional()
        .refine((val) => !val || (val >= 0 && val <= 100), {
          message: "Lymphocytes percentage must be between 0 and 100%",
        }),
      reference: z.object({
        min: z.number(),
        max: z.number(),
        unit: z.string(),
      }),
    }),
    monocytes: z.object({
      value: z
        .number()
        .optional()
        .refine((val) => !val || (val >= 0 && val <= 100), {
          message: "Monocytes percentage must be between 0 and 100%",
        }),
      reference: z.object({
        min: z.number(),
        max: z.number(),
        unit: z.string(),
      }),
    }),
    eosinophils: z.object({
      value: z
        .number()
        .optional()
        .refine((val) => !val || (val >= 0 && val <= 100), {
          message: "Eosinophils percentage must be between 0 and 100%",
        }),
      reference: z.object({
        min: z.number(),
        max: z.number(),
        unit: z.string(),
      }),
    }),
    basophils: z.object({
      value: z
        .number()
        .optional()
        .refine((val) => !val || (val >= 0 && val <= 100), {
          message: "Basophils percentage must be between 0 and 100%",
        }),
      reference: z.object({
        min: z.number(),
        max: z.number(),
        unit: z.string(),
      }),
    }),
  }),
  bloodCellMorphology: z.object({
    requested: z.boolean(),
    comments: z.string().optional(),
  }),
});

const ParasitologyValidationSchema = z.object({
  malariaBloodFilm: z.object({
    requested: z.boolean(),
    result: z.string().optional(),
  }),
  stoolMicroscopy: z.object({
    requested: z.boolean(),
    result: z.string().optional(),
  }),
  urineMicroscopy: z.object({
    requested: z.boolean(),
    result: z.string().optional(),
  }),
  fluidAnalysis: z.object({
    requested: z.boolean(),
    appearance: z.string().optional(),
    color: z.string().optional(),
    glucose: z.string().optional(),
    protein: z.string().optional(),
    wbcCount: z.string().optional(),
    gramStain: z.string().optional(),
  }),
});

const RapidTestValidationSchema = z.object({
  malaria: z.object({
    requested: z.boolean(),
    result: z.string().optional(),
  }),
  hepBsAg: z.object({
    requested: z.boolean(),
    result: z.string().optional(),
  }),
  syphillis: z.object({
    requested: z.boolean(),
    result: z.string().optional(),
  }),
  pregnancyTest: z.object({
    requested: z.boolean(),
    result: z.string().optional(),
  }),
  hepEsAg: z.object({
    requested: z.boolean(),
    result: z.string().optional(),
  }),
  hepCsAg: z.object({
    requested: z.boolean(),
    result: z.string().optional(),
  }),
  rk39: z.object({
    requested: z.boolean(),
    result: z.string().optional(),
  }),
  bloodGroup: z.object({
    requested: z.boolean(),
    result: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(val),
        {
          message:
            "Blood group must be a valid blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)",
        }
      ),
  }),
  hiv: z.object({
    requested: z.boolean(),
    result: z.string().optional(),
  }),
});

const UrineDipstickValidationSchema = z.object({
  requested: z.boolean(),
  leucocytes: z.string().optional(),
  blood: z.string().optional(),
  protein: z.string().optional(),
  ketone: z.string().optional(),
  nitrate: z.string().optional(),
  glucose: z.string().optional(),
  bilirubin: z.string().optional(),
  urobilin: z.string().optional(),
  pH: z
    .string()
    .optional()
    .refine((val) => !val || (parseFloat(val) >= 4.5 && parseFloat(val) <= 9), {
      message: "pH must be between 4.5 and 9",
    }),
});

const ClinicalChemistryValidationSchema = z.object({
  randomBloodSugar: z.object({
    requested: z.boolean(),
    value: z
      .number()
      .optional()
      .refine((val) => !val || (val >= 20 && val <= 500), {
        message: "Random blood sugar must be between 20 and 500 mg/dL",
      }),
    reference: z.object({
      min: z.number(),
      max: z.number(),
      unit: z.string(),
    }),
  }),
  fastingBloodSugar: z.object({
    requested: z.boolean(),
    value: z
      .number()
      .optional()
      .refine((val) => !val || (val >= 20 && val <= 500), {
        message: "Fasting blood sugar must be between 20 and 500 mg/dL",
      }),
    reference: z.object({
      min: z.number(),
      max: z.number(),
      unit: z.string(),
    }),
  }),
  creatinine: z.object({
    requested: z.boolean(),
    value: z
      .number()
      .optional()
      .refine((val) => !val || (val >= 0.1 && val <= 20), {
        message: "Creatinine must be between 0.1 and 20 mg/dL",
      }),
  }),
  alt: z.object({
    requested: z.boolean(),
    value: z
      .number()
      .optional()
      .refine((val) => !val || (val >= 0 && val <= 2000), {
        message: "ALT must be between 0 and 2000 U/L",
      }),
  }),
});

// Main validation schema
export const LabReportValidationSchema = z.object({
  // Patient Information
  // ...PatientValidationSchema.shape,
  patient:  z.string(),

  // Sample Information
  ...SampleValidationSchema.shape,

  // Test Categories
  hematologyTests: HematologyValidationSchema,
  parasitologyFluidTests: ParasitologyValidationSchema,
  rapidDiagnosticTests: RapidTestValidationSchema,
  urineDipstickTests: UrineDipstickValidationSchema,
  clinicalChemistry: ClinicalChemistryValidationSchema,

  // Additional Information
  comments: z.string().optional(),

  //doctor or nurse
//   requestedBy: z.string().min(1, { message: "Requester name is required" }),
  requestedBy: z.string(),


  //lab technician
  performedBy:  z.string(),

  // Metadata
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});
