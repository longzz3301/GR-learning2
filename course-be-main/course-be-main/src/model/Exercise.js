const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const ExerciseModel = new Schema(
  {
    topic_id: {
      type: String,
      required: true,
    },
    ex_question: {
      type: [Object],
    },
  }
);
module.exports = mongoose.model("Exercise", ExerciseModel);
