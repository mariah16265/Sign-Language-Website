const path = require('path');
const fs = require('fs');
const SignsData = require('../models/signsData.model');
const lessonGrouping = require('./lessonGrouping'); // Import the configuration file

// Path to Sign subject Videos
const baseFolderPath = path.join(__dirname, '../../FRONTEND/src/Sign Language Videos');

// Function to group videos into lessons
const groupVideosIntoLessons = (videos, videosPerLesson) => {
  const lessons = [];
  let lesson = [];
  for (let i = 0; i < videos.length; i++) {
    lesson.push(videos[i]);
    // If the lesson reaches the limit, start a new lesson
    if (lesson.length === videosPerLesson) {
      lessons.push(lesson);
      lesson = []; // Reset for the next lesson
    }
  }
  // Add any remaining videos to the last lesson
  if (lesson.length > 0) {
    lessons.push(lesson);}
  return lessons;
};

async function signsDataSync() {
  try {
    const subjects = fs.readdirSync(baseFolderPath);   // All folders like English, Arabic, Maths
    const existingModules = await SignsData.find({});   //Current records in MongoDB 

    let modulesFromFolder = [];     //collects: subject, module name, lessons array with { title, videoUrl }

    //Loop through each subject folder inside "Sign subject Videos"
    for (const subject of subjects) {
      const subjectPath = path.join(baseFolderPath, subject);
      //Check if the "subject" is actually a folder (Eng/Arabic/Maths)
      if (fs.lstatSync(subjectPath).isDirectory()) {
        const modules = fs.readdirSync(subjectPath);
        //Loop through each module inside that subject folder (Alphabets, Intro..)
        for (const module of modules) {
          const modulePath = path.join(subjectPath, module);
          // Check if the "module" is actually a folder
          if (fs.lstatSync(modulePath).isDirectory()) {
            const videos = fs.readdirSync(modulePath)
              .filter(file => file.endsWith('.mp4'))
              .map(file => ({
                title: path.parse(file).name,
                videoUrl: `/Sign Language Videos/${subject}/${module}/${file}`
              }));

            // Get videosPerLesson from lessonGrouping
            const videosPerLesson = lessonGrouping[subject] && lessonGrouping[subject][module]
            ? lessonGrouping[subject][module]
            : 3; // default to 3 if not specified
            const groupedLessons = groupVideosIntoLessons(videos, videosPerLesson);
            //Save the module (with lessons) to an array, push each lesson separately
            groupedLessons.forEach((lesson, index) => {
              modulesFromFolder.push({
                subject,
                module,
                lessonNumber: index + 1, // lesson 1, 2, 3
                signs: lesson
              });
            });
          }
        }
      }
    }
    // 1. Delete all existing lessons for each subject/module before reinserting
    for (const folderModule of modulesFromFolder) {
        await SignsData.deleteMany({
          subject: folderModule.subject,
          module: folderModule.module
        });
       // console.log(`Deleted all existing lessons for module: ${folderModule.module} (${folderModule.subject})`);
    }console.log('Syncing...') 

    // 2. Insert new lessons for the modules
    for (const folderModule of modulesFromFolder) {
      // Directly insert the new module data
      const newModule = new SignsData(folderModule);
      await newModule.save();
      //console.log(`Created new module: ${folderModule.module} (${folderModule.subject})`);
    }
    console.log('✅ SignsData Synced with DB.');
  } catch (err) {
    console.error('Error during syncing:', err);
  }
}

module.exports = signsDataSync;