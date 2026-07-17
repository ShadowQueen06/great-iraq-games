const quiz = require("../games/quiz.js");
const xo = require("../games/xo.js");
const groupLobby = require("../games/groupLobby.js");
const tf = require("../games/truefalse.js");
const blackjack = require("../games/blackjack.js");

module.exports = async interaction => {
  try {
    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith("lobby_")) {
      return groupLobby.handleButton(interaction);
    }

    if (interaction.customId.startsWith("xo_")) {
      return xo.handleButton(interaction);
    }

    if (interaction.customId.startsWith("quiz_answer_")) {
      return quiz.handleButton(interaction);
    }

    if (interaction.customId.startsWith("tf_")) {
      return tf.handleButton(interaction);
    }

    if (interaction.customId.startsWith("bj_")) {
      return blackjack.handleButton(interaction);
    }
  } catch (error) {
    console.error("Interaction error:", error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "صار خطأ.",
        ephemeral: true
      }).catch(() => {});
    }
  }
};
