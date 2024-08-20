const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('All colours requested');
    // I want them in vote order
    colours = await coll.find({}).sort({ votes: 1 }).toArray();
    res.send({ colours });
  } catch (error) {
    console.error(`Failed to fetch colours ${error}`);
    res.status(500).send({ error: 'Failed to fetch colours' });
  }
});

router.post('/', async (req, res) => {
  try {
    // Read in new colour
    const colour = req.body.colour;
    // Colour blank?
    if (colour === '') {
      return res.status(400).send({ error: 'Empty body' });
    }
    // No colour property?
    if (!colour) {
      return res.status(400).send({ error: 'Malformed body' });
    }
    //   Is it already in the DB?
    const existingColour = await coll.findOne({ name: colour });
    if (existingColour) {
      return res.status(400).send({ error: 'Duplicate colour' });
    }

    // Passed validation - make a new object
    // Has 1 vote as creating classes as voting too
    const newColour = {
      name: colour,
      votes: 1,
    };

    console.log(`Submitting ${JSON.stringify(newColour)} to DB`);
    await coll.insertOne(newColour);
    // Re-render page?
    res.send({ message: 'success' });
  } catch (error) {
    console.error(`Failed to add colour ${error}`);
    res.status(500).send({ error: 'Failed to add colour' });
  }
});

router.put('/:colour/:direction', async (req, res) => {
  try {
    const colour = req.params.colour;
    const change = req.params.direction === 'up' ? 1 : -1;
    // Increment vote count
    const dbRes = await coll.updateOne({ name: colour }, [
      {
        $set: {
          votes: {
            $max: [{ $add: ['$votes', change] }, 0],
          },
        },
      },
    ]);
    // Record didn't exist?
    if (dbRes.matchedCount === 0) {
      return res.status(400).send({ error: 'Invalid colour' });
    }
    res.send({ message: 'Success' });
  } catch (error) {
    console.error(`Failed to update colour ${error}`);
    res.status(500).send({ error: 'Failed to update colour' });
  }
});

router.delete('/:colour', async (req, res) => {
  try {
    const colour = req.params.colour;

    //   Send request to delete
    const dbRes = await coll.deleteOne({ name: colour });

    // Respond based on code - deleted v not
    if (dbRes.deletedCount === 0) {
      return res.status(400).send({ error: 'Not there to delete' });
    }
    //  Frontend reloads page
    res.json({ colour, status: 'deleted' });
  } catch (error) {
    console.error(`Failed to delete colour ${error}`);
    res.status(500).send({ error: 'Failed to delete colour' });
  }
});

module.exports = router;
