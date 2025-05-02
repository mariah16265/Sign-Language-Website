const path = require('path');
const fs = require('fs');

// Base folder where Sign Language Videos are stored
const baseFolderPath = path.join(__dirname, '../../FRONTEND/public/Sign Language Videos');

// Function to extract all subject > module names
function extractSubjectModuleNames() {
  const subjects = fs.readdirSync(baseFolderPath);
  const subjectModuleMap = {};

  for (const subject of subjects) {
    const subjectPath = path.join(baseFolderPath, subject);

    if (fs.lstatSync(subjectPath).isDirectory()) {
      const modules = fs.readdirSync(subjectPath).filter(m => fs.lstatSync(path.join(subjectPath, m)).isDirectory());

      subjectModuleMap[subject] = modules;
    }
  }

  console.log('📋 Folder Structure (Subject > Modules):');
  console.log(JSON.stringify(subjectModuleMap, null, 2));  // Nicely formatted JSON
}

extractSubjectModuleNames();
