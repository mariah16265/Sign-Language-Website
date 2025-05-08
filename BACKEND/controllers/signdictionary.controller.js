const SignsData = require('../models/signsData.model');

const getSignDictionary = async (req, res) => {
  try {
    const allSigns = await SignsData.find({});

    const grouped = {};
    for (const entry of allSigns) {
      if (!grouped[entry.subject]) grouped[entry.subject] = [];
      grouped[entry.subject] = grouped[entry.subject].concat(entry.signs);
    }

    const response = Object.keys(grouped).map(subject => ({
      subject,
      signs: grouped[subject],
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching signs data', error });
  }
};

module.exports = { getSignDictionary };
