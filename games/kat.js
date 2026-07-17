const { EmbedBuilder } = require("discord.js");
const { color } = require("../config.js");
const questions = require("../data/kat_questions.json");
const { addReward } = require("../utils/db.js");

let lastQuestionId = null;

function questionEmbed(user) {
  let question;

  do {
    question = questions[Math.floor(Math.random() * questions.length)];
  } while (
    questions.length > 1 &&
    question.id === lastQuestionId
  );

  lastQuestionId = question.id;

  addReward(user, 1, 1, "kat");

  return new EmbedBuilder()
    .setColor(color)
    .setTitle("🎭 كت")
    .setDescription(question.question);
}

module.exports = {
  questionEmbed
};
