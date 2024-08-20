const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    colours = await coll.find({}).sort({ votes: -1 }).toArray();
    res.render('index.ejs', { colours });
  } catch (error) {
    console.error(`Failed to fetch homepage ${error}`);
    res.status(500).send({ error: 'Failed to fetch homepage' });
  }
  // res.sendFile(Path.join(__dirname, 'public', 'index.html'));
});

module.exports = router;
