import Colour from '../models/Colour.js';

export async function getColours(req, res) {
  try {
    console.log('All colours requested');
    // I want them in vote order
    const colours = await Colour.find({}).sort({ votes: 1 });
    res.send({ colours });
  } catch (error) {
    console.error(`Failed to fetch colours ${error}`);
    res.status(500).send({ error: 'Failed to fetch colours' });
  }
}

export async function addColour(req, res) {
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
    const existingColour = await Colour.findOne({ name: colour });
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
    await Colour.create(newColour);
    // Re-render page?
    res.send({ message: 'success' });
  } catch (error) {
    console.error(`Failed to add colour ${error}`);
    res.status(500).send({ error: 'Failed to add colour' });
  }
}

export async function voteColour(req, res) {
  try {
    const colour = req.params.colour;
    const change = req.params.direction === 'up' ? 1 : -1;
    // Increment vote count
    const dbRes = await Colour.updateOne({ name: colour }, [
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
}

export async function removeColour(req, res) {
  try {
    const colour = req.params.colour;

    //   Send request to delete
    const dbRes = await Colour.deleteOne({ name: colour });

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
}
