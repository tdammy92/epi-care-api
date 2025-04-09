

import mongoose from "mongoose";
import { LabReportValidationSchema } from "../schema/lab.schema";
import { validate } from "uuid";
const { Schema } = mongoose;

// Mongoose schema with validation
const labReportSchema = new Schema({
  // Patient Information
  patient:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  labNo: String,
  clinicalIndication: String,
  
  // Sample Information
  sampleType: {
    type: String,
    enum: {
      values: ['Blood', 'Urine', 'Stool', 'CSF', 'Others'],
      message: "Sample type must be one of: Blood, Urine, Stool, CSF, or Others"
    },
    required: [true, "Sample type is required"]
  },
  otherSampleSpecification: String,
  
  // Hematology Tests
  hematologyTests: {
    hemoglobin: {
      requested: Boolean,
      value: {
        type: Number,
        min: [1, "Hemoglobin must be at least 1 g/dL"],
        max: [25, "Hemoglobin must be less than 25 g/dL"]
      },
      reference: {
        min: { type: Number, default: 12 },
        max: { type: Number, default: 17 },
        unit: { type: String, default: 'g/dL' }
      }
    },
    wbcCount: {
      requested: Boolean,
      value: {
        type: Number,
        min: [1000, "WBC count must be at least 1,000 /mm³"],
        max: [50000, "WBC count must be less than 50,000 /mm³"]
      },
      reference: {
        min: { type: Number, default: 4800 },
        max: { type: Number, default: 10800 },
        unit: { type: String, default: '/mm³' }
      }
    },
    differentialCount: {
      requested: Boolean,
      neutrophils: {
        value: {
          type: Number,
          min: [0, "Neutrophils percentage must be at least 0%"],
          max: [100, "Neutrophils percentage must be less than 100%"]
        },
        reference: {
          min: { type: Number, default: 40 },
          max: { type: Number, default: 75 },
          unit: { type: String, default: '%' }
        }
      },
      lymphocytes: {
        value: {
          type: Number,
          min: [0, "Lymphocytes percentage must be at least 0%"],
          max: [100, "Lymphocytes percentage must be less than 100%"]
        },
        reference: {
          min: { type: Number, default: 20 },
          max: { type: Number, default: 40 },
          unit: { type: String, default: '%' }
        }
      },
      monocytes: {
        value: {
          type: Number,
          min: [0, "Monocytes percentage must be at least 0%"],
          max: [100, "Monocytes percentage must be less than 100%"]
        },
        reference: {
          min: { type: Number, default: 2 },
          max: { type: Number, default: 10 },
          unit: { type: String, default: '%' }
        }
      },
      eosinophils: {
        value: {
          type: Number,
          min: [0, "Eosinophils percentage must be at least 0%"],
          max: [100, "Eosinophils percentage must be less than 100%"]
        },
        reference: {
          min: { type: Number, default: 1 },
          max: { type: Number, default: 6 },
          unit: { type: String, default: '%' }
        }
      },
      basophils: {
        value: {
          type: Number,
          min: [0, "Basophils percentage must be at least 0%"],
          max: [100, "Basophils percentage must be less than 100%"]
        },
        reference: {
          min: { type: Number, default: 0 },
          max: { type: Number, default: 1 },
          unit: { type: String, default: '%' }
        }
      }
    },
    bloodCellMorphology: {
      requested: Boolean,
      comments: String
    }
  },
  
  // Parasitology/Fluid Analysis
  parasitologyFluidTests: {
    malariaBloodFilm: {
      requested: Boolean,
      result: String
    },
    stoolMicroscopy: {
      requested: Boolean,
      result: String
    },
    urineMicroscopy: {
      requested: Boolean,
      result: String
    },
    fluidAnalysis: {
      requested: Boolean,
      appearance: String,
      color: String,
      glucose: String,
      protein: String,
      wbcCount: String,
      gramStain: String
    }
  },
  
  // Rapid Diagnostic Tests (RDTs)
  rapidDiagnosticTests: {
    malaria: {
      requested: Boolean,
      result: String
    },
    hepBsAg: {
      requested: Boolean,
      result: String
    },
    syphillis: {
      requested: Boolean,
      result: String
    },
    pregnancyTest: {
      requested: Boolean,
      result: String
    },
    hepEsAg: {
      requested: Boolean,
      result: String
    },
    hepCsAg: {
      requested: Boolean,
      result: String
    },
    rk39: {
      requested: Boolean,
      result: String
    },
    bloodGroup: {
      requested: Boolean,
      result: {
        type: String,
        enum: {
          values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
          message: "Blood group must be a valid blood type"
        }
      }
    },
    hiv: {
      requested: Boolean,
      result: String
    }
  },
  
  // Urine Dipstick Tests
  urineDipstickTests: {
    requested: Boolean,
    leucocytes: String,
    blood: String,
    protein: String,
    ketone: String,
    nitrate: String,
    glucose: String,
    bilirubin: String,
    urobilin: String,
    pH: {
      type: String,
      validate: {
        validator: function(v:any) {
          if (!v) return true;
          const num = parseFloat(v);
          return !isNaN(num) && num >= 4.5 && num <= 9;
        },
        message: "pH must be between 4.5 and 9"
      }
    }
  },
  
  // Clinical Chemistry
  clinicalChemistry: {
    randomBloodSugar: {
      requested: Boolean,
      value: {
        type: Number,
        min: [20, "Random blood sugar must be at least 20 mg/dL"],
        max: [500, "Random blood sugar must be less than 500 mg/dL"]
      },
      reference: {
        min: { type: Number, default: 75 },
        max: { type: Number, default: 140 },
        unit: { type: String, default: 'mg/dL' }
      }
    },
    fastingBloodSugar: {
      requested: Boolean,
      value: {
        type: Number,
        min: [20, "Fasting blood sugar must be at least 20 mg/dL"],
        max: [500, "Fasting blood sugar must be less than 500 mg/dL"]
      },
      reference: {
        min: { type: Number, default: 70 },
        max: { type: Number, default: 150 },
        unit: { type: String, default: 'mg/dL' }
      }
    },
    creatinine: {
      requested: Boolean,
      value: {
        type: Number,
        min: [0.1, "Creatinine must be at least 0.1 mg/dL"],
        max: [20, "Creatinine must be less than 20 mg/dL"]
      }
    },
    alt: {
      requested: Boolean,
      value: {
        type: Number,
        min: [0, "ALT must be at least 0 U/L"],
        max: [2000, "ALT must be less than 2000 U/L"]
      }
    }
  },
  
  // Additional Information
  comments: String,
  requestedBy: {
    type:Schema.Types.ObjectId,
    ref:'User',
    // required: [true, "Requester name is required"]
  },
  performedBy: {
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
},{
  timestamps:true
});

// Pre-save middleware for updating the 'updatedAt' field
labReportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Middleware for Zod validation before saving
// labReportSchema.pre('validate', async function(next) {
//   try {
//     // Convert Mongoose document to plain object for Zod validation
//     const plainObject = this.toObject();
    
//     // Validate using Zod schema
//     const validationResult = LabReportValidationSchema.safeParse(plainObject);
    
//     if (!validationResult.success) {
//       const error = new mongoose.Error.ValidationError();
      
//       // Format Zod errors for Mongoose
//       validationResult.error.errors.forEach(err => {
//         const path = err.path.join('.');
//         error.errors[path] = new mongoose.Error.ValidatorError({
//           message: err.message,
//           path: path
//         });
//       });
      
//       return next(error);
//     }
    
//     next();
//   } catch (err:any) {
//     next(err);
//   }
// });

// Static method to validate data using Zod without saving
labReportSchema.statics.validateWithZod = function(data) {
  return LabReportValidationSchema.safeParse(data);
};

// Create and export the model
const LabReportModel = mongoose.model('LabReport', labReportSchema);


export default LabReportModel