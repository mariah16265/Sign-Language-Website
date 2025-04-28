const SignsData = require('../models/signsData.model');

// Controller to fetch all modules
const getAllModules = async (req, res) => {
  try {
    const modules = await SignsData.find({});
    res.status(200).json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ message: 'Failed to fetch modules' });
  }
};

const getModulesBySub = async (req, res) => {
  console.log('Subject ID received:', req.params.subjectId);
  try {
    const subjectId = req.params.subjectId; // <-- this grabs 'english', 'arabic' etc from URL
    const modules = await SignsData.find({language: subjectId }); // <-- assuming you have a 'subjectId' field in your MongoDB modules
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules for subject', error });
  }
};
module.exports = { getAllModules, getModulesBySub };
