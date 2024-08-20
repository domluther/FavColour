const { Colour } = require('../models/Colour');

async function getIndex(req, res) {
  try {
    const colours = await Colour.find().sort({ votes: -1 });
    res.render('index.ejs', { colours });
  } catch (error) {
    console.error(`Failed to fetch homepage ${error}`);
    res.status(500).send({ error: 'Failed to fetch homepage' });
  }
}

module.exports = { getIndex };
