const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const QuizQuestion = require('../models/quizQuestions.model');
const questionsConfig = require('./questionsConfig');

function convertToPublicPath(absolutePath) {
  if (!absolutePath) return undefined;
  const idx = absolutePath.indexOf('/public/');
  return idx !== -1 ? absolutePath.slice(idx + '/public'.length).replace(/\\/g, '/') : absolutePath;
}

function parseEntry(entry) {
  // Example: "1-Static-Y-'D:/.../Y.jpg'"
  const regex = /^\d+\-(Static|Dynamic)\-([A-Za-z\u0600-\u06FF]+)(?:\-['"]?(.+?)['"]?)?$/;
  const match = entry.match(regex);
  if (!match) return null;

  const [, typeRaw, signTitle, imagePathRaw] = match;
  const type = typeRaw.toLowerCase();
  const signUrl = type === 'static' ? convertToPublicPath(imagePathRaw) : undefined;

  return { type, signTitle, signUrl };
}

async function questionsDataSync() {
  try {
    const existingQuestions = await QuizQuestion.find({});
    const existingLookup = new Map();

    // Build a key-based lookup from DB
    for (const doc of existingQuestions) {
      const key = `${doc.subject}-${doc.level}-${doc.module}-${doc.signTitle}`;
      existingLookup.set(key, doc._id.toString());
    }

    const validKeys = new Set();

    let inserted = 0, updated = 0;

    for (const subject in questionsConfig) {
      const levels = questionsConfig[subject];

      for (const level in levels) {
        const modules = levels[level];

        for (const moduleName in modules) {
          const entries = modules[moduleName];

          for (const entry of entries) {
            const parsed = parseEntry(entry);
            if (!parsed) {
              console.warn(`⚠️ Skipped invalid entry: ${entry}`);
              continue;
            }

            const { type, signTitle, signUrl } = parsed;
            const key = `${subject}-${level}-${moduleName}-${signTitle}`;
            validKeys.add(key);

            const updateData = {
              type,
              subject,
              level,
              module: moduleName,
              signTitle,
              signUrl
            };

            if (existingLookup.has(key)) {
              // Existing doc found, get its _id
              const existingId = existingLookup.get(key);

              // Fetch existing doc
              const existingDoc = await QuizQuestion.findById(existingId).lean();

              // Compare existingDoc fields with updateData to detect change
              const hasChanged = ['type', 'subject', 'level', 'module', 'signTitle', 'signUrl'].some(
                field => existingDoc[field] !== updateData[field]
              );

              if (hasChanged) {
                // Only update if something changed
                await QuizQuestion.findByIdAndUpdate(existingId, updateData, { new: true, setDefaultsOnInsert: true });
                updated++;
              }
              // else no changes, don't update or increment
            } else {
              // New document
              await QuizQuestion.create(updateData);
              inserted++;
            }
          }
        }
      }
    }

    // Delete orphaned questions
    for (const doc of existingQuestions) {
      const key = `${doc.subject}-${doc.level}-${doc.module}-${doc.signTitle}`;
      if (!validKeys.has(key)) {
        await QuizQuestion.deleteOne({ _id: doc._id });
        console.log(`🗑️ Deleted orphan question: ${key}`);
      }
    }

    console.log(`✅ Quiz questions synced. Inserted: ${inserted}, Updated: ${updated}`);
  } catch (err) {
    console.error('❌ Error syncing quiz questions:', err);
  }
}

module.exports = questionsDataSync;
