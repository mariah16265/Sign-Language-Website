const path = require('path');
const fs = require('fs');
const SignsData = require('../models/signsData.model');
const lessonGrouping = require('./lessonGrouping');
const mongoose = require('mongoose');

const baseFolderPath = path.join(__dirname, '../../FRONTEND/public/Sign Language Videos');

// Utility to group videos into lessons
const groupVideosIntoLessons = (videos, videosPerLesson) => {
  const lessons = [];
  let lesson = [];
  for (let i = 0; i < videos.length; i++) {
    lesson.push(videos[i]);
    if (lesson.length === videosPerLesson) {
      lessons.push(lesson);
      lesson = [];
    }
  }
  if (lesson.length > 0) lessons.push(lesson);
  return lessons;
};

async function signsDataSync() {
  try {
    const subjects = fs.readdirSync(baseFolderPath);
    const existingLessons = await SignsData.find({});
    const existingLookup = new Map();

    // Create a map of existing lessons
    for (const doc of existingLessons) {
      const key = `${doc.subject}-${doc.module}-${doc.lessonNumber}`;
      existingLookup.set(key, doc._id);
    }

    const validKeys = new Set(); // Store lessons that still exist in the folder

    // Loop through folder structure
    for (const subject of subjects) {
      const subjectPath = path.join(baseFolderPath, subject);
      if (!fs.lstatSync(subjectPath).isDirectory()) continue;

      const modules = fs.readdirSync(subjectPath);
      for (const module of modules) {
        const modulePath = path.join(subjectPath, module);
        if (!fs.lstatSync(modulePath).isDirectory()) continue;

        const videoFiles = fs.readdirSync(modulePath)
          .filter(file => file.endsWith('.mp4'))
          .sort((a, b) => {
            const numA = parseInt(path.parse(a).name);
            const numB = parseInt(path.parse(b).name);
            return numA - numB;
          });
        
        const videos = videoFiles.map(file => ({
          title: path.parse(file).name,
          videoUrl: `/Sign Language Videos/${subject}/${module}/${file}`
        }));

        const videosPerLesson = lessonGrouping[subject]?.[module] || 3;
        const groupedLessons = groupVideosIntoLessons(videos, videosPerLesson);

        for (let lessonIndex = 0; lessonIndex < groupedLessons.length; lessonIndex++) {
          const lessonNumber = lessonIndex + 1;
          const key = `${subject}-${module}-${lessonNumber}`;
          validKeys.add(key); // Mark as valid

          // Look up the existing signs for the lesson
          const oldLesson = existingLessons.find(doc => doc.subject === subject && doc.module === module && doc.lessonNumber === lessonNumber);
          let existingSignsMap = new Map();

          if (oldLesson) {
            // Map existing signs by title to retain their signID
            for (const sign of oldLesson.signs) {
              existingSignsMap.set(sign.title, sign._id);
            }
          }

          // Enrich the new signs with the existing _id (if any)
          const enrichedSigns = groupedLessons[lessonIndex].map(sign => ({
            ...sign,
            _id: existingSignsMap.get(sign.title) || new mongoose.Types.ObjectId() // Use existing signID or generate a new one
          }));

          const updateData = {
            subject,
            module,
            lessonNumber,
            signs: enrichedSigns
          };

          // Retain existing _id if present
          if (existingLookup.has(key)) {
            updateData._id = existingLookup.get(key);
          }

          await SignsData.findOneAndUpdate(
            { subject, module, lessonNumber },
            updateData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
      }
    }

    // Delete orphan lessons (no longer present in folders)
    const allDbLessons = await SignsData.find({});
    for (const doc of allDbLessons) {
      const key = `${doc.subject}-${doc.module}-${doc.lessonNumber}`;
      if (!validKeys.has(key)) {
        await SignsData.deleteOne({ _id: doc._id });
        console.log(`🗑️ Deleted orphan lesson: ${key}`);
      }
    }

    console.log('✅ SignsData synced successfully with stable IDs and folder match.');
  } catch (err) {
    console.error('❌ Error during syncing:', err);
  }
}

module.exports = signsDataSync;
