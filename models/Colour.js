import mongoose from 'mongoose';

const collName = 'colours';

const colourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    required: true,
  },
});

const Colour = mongoose.model(collName, colourSchema);

export default Colour;
