const { EmbedBuilder } = require("discord.js");
const { color } = require("../config.js");
const questions = require("../data/kat_questions.json");
const { addReward } = require("../utils/db.js");

let lastQuestion = null;

module.exports = {
  questionEmbed(user) {
    let question;

    do {
      question = questions[Math.floor(Math.random() * questions.length)];
    } while (
      lastQuestion &&
      question.id === lastQuestion.id &&
      questions.length > 1
    );

    lastQuestion = question;

    addReward(user, 1, 1, "kat");

    return new EmbedBuilder()
      .setColor(color)
      .setTitle("🎭 لعبة كت")
      .setDescription(`### ${question.question}`)
      .setFooter({
        text: "جاوب بصراحة 😄"
      });
  }
};
