// Import model
const { Colour } = require('../models/Colour');

async function getIndex(req, res) {
  try {
    console.log(Colour);
    const colours = await Colour.find();
    console.log(colours);
    res.render('index.ejs', { colours });
  } catch (error) {
    console.error(`Failed to fetch homepage ${error}`);
    res.status(500).send({ error: 'Failed to fetch homepage' });
  }
}

module.exports = { getIndex };
