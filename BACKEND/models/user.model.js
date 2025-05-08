//models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Facilitator/Grown-up Information
    Fname: {
      type: String,
      required: true,
    },
    Forganization: {
      type: String,
      required: function () {
        return !['parent', 'caregiver'].includes(this.Frole);
      },
    },
    Frole: {
      type: String,
      required: true,
      enum: [
        'teacher',
        'ngo_worker',
        'caregiver',
        'speech_therapist',
        'parent',
      ],
    },
    Femail: {
      type: String,
      required: true,
      unique: true,
    },
    Fphone: {
      type: String,
      required: true,
    },
    Faddress: {
      type: String,
      required: function () {
        return !['parent', 'caregiver'].includes(this.Frole);
      },
    },

    // Child Information
    Cname: {
      type: String,
      required: true,
    },
    Cdob: {
      type: String,
      required: true,
    },
    Cgender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    Cdisability: {
      // Now optional
      type: String,
      required: false, // Explicitly set to false
      enum: [
        'hearing_impairment',
        'speech_disorder',
        'autism_verbal',
        'autism_nonverbal',
        'intellectual',
        'down_syndrome',
        'cerebral_palsy',
        'multiple_disabilities',
      ],
    },

    // Account Setup
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
