// mongoose connection and schema definition
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/diabetes-database", {
    serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("failed to connect");
  });

const LogInSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email:{
    type: String
  },
  fname: {
    type: String
  },
  lname: {
    type: String
  },
  diseases:{
    type:[String]
  },
  age:{
    type: Number,
    required: false
  },
  gender:{
    type: String
  },
  type:{
    type: String
  },
  weight:{
    type: Number
  },
  isActive: { type: Boolean, default: true },
  sugarLogs:[{ type: Schema.Types.ObjectId, ref: 'SugarLog' }], // Array of references to SugarLog
  exerciseLogs: [{type: Schema.Types.ObjectId, ref: 'ExerciseLog' }], // Array of references to ExerciseLog
  medicationLogs: [{type: Schema.Types.ObjectId, ref: 'MedicationLog' }] // Array of references to ExerciseLog
});

const User = mongoose.model("User", LogInSchema);

// Sugar Log Schema
const sugarLogSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    date: { type: Date, default: Date.now },
    timeOfDay: { type: String, required: true }, 
    sugarLevel: { type: String, required: false }, 
    sugarLevel: { type: Number, required: true }, 
    notes: { type: String } 
});

const SugarLog = mongoose.model('SugarLog', sugarLogSchema);

//Exercise Log Schema
const exerciseLogSchema = new Schema({

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  typeOfExercise: {type: String, required: true },
  duration: {type: Number, required: true},
  caloriesBurned: {type: Number},
  dateCollected: {type: Date, default: Date.now}
});
const ExerciseLog = mongoose.model('ExerciseLog', exerciseLogSchema);

//Medication Log Schema
const medicationLogSchema = new Schema({

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  medName: {type: String, required: true},
  frequency: {type: String, required: true},
  time: {type: String, required: true}

});
const MedicationLog = mongoose.model('MedicationLog', medicationLogSchema);

//Admin Schema
const adminSchema = new Schema({
  name: {type: String, required: true, unique: true},
  email:{ type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', adminSchema);

const adviceCriteriaSchema = new mongoose.Schema({
  ageRanges: [
    {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      advice: { type: String, required: true },
    },
  ],
  gender: [
    {
      type: { type: String, required: true },
      advice: { type: String, required: true },
    },
  ],
  diabetesTypes: [
    {
      type: { type: String, required: true },
      advice: { type: String, required: true },
    },
  ],
  relatedDiseases: [
    {
      disease: { type: String, required: true },
      advice: { type: String, required: true },
    },
  ],
  aggregatedData: [
    {
      condition: { type: String, required: true }, // e.g., "averageSugarLevel > 140"
      advice: { type: String, required: true },
    },
  ],
  aggregatedDataConditions: [
    {
        key: { type: String, required: true }, // e.g., "averageSugarLevel"
        threshold: { type: Number, required: true }, // e.g., 140
        comparison: { type: String, required: true }, // e.g., "greaterThan" or "lessThan"
        advice: { type: String, required: true }, // e.g., "Your sugar level is too high."
    },
],
});

const AdviceCriteria = mongoose.model('AdviceCriteria', adviceCriteriaSchema);

module.exports = {
  User,
  SugarLog,
  ExerciseLog,
  MedicationLog,
  Admin,
  AdviceCriteria
};