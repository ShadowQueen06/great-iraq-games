const {
  prefix,
  statsChannelId
} = require("../config.js");

const { mainMenuEmbed } = require("../utils/menu.js");

const xo = require("../games/xo.js");
const kat = require("../games/kat.js");
const quiz = require("../games/quiz.js");
const solo = require("../games/solo.js");
const flags = require("../games/flags.js");
const math = require("../games/math.js");
const groupLobby = require("../games/groupLobby.js");
const profile = require("../games/profile.js");
const geo = require("../games/geography.js");
const tf = require("../games/truefalse.js");
const scramble = require("../games/scramble.js");
const blackjack = require("../games/blackjack.js");

module.exports = async message => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(prefix)
  ) {
    return;
  }

  const cmd = message.content
    .slice(prefix.length)
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();

  if (cmd === "العاب") {
    return message.reply({
      embeds: [mainMenuEmbed()]
    });
  }

  if (["بروفايل", "احصائياتي", "توب"].includes(cmd)) {
    if (message.channel.id !== statsChannelId) {
      return message.reply(
        `استخدم أوامر الإحصائيات في <#${statsChannelId}>`
      );
    }

    return message.reply({
      embeds: [
        cmd === "توب"
          ? profile.topEmbed()
          : profile.profileEmbed(message.author)
      ]
    });
  }

  if (cmd === "كت") {
    return message.reply({
      embeds: [kat.questionEmbed(message.author)]
    });
  }

  if (cmd === "كويز") {
    return quiz.start(message);
  }

  if (cmd === "اعلام") {
    return flags.start(message);
  }

  if (cmd === "عواصم") {
    return geo.capitals(message);
  }

  if (cmd === "دول") {
    return geo.countries(message);
  }

  if (cmd === "عملات") {
    return geo.currencies(message);
  }

  if (cmd === "رياضيات") {
    return math.start(message);
  }

  if (cmd === "تخمين") {
    return solo.startNumberGuess(message);
  }

  if (cmd === "صح") {
    return tf.start(message);
  }

  if (cmd === "ترتيب") {
    return scramble.start(message);
  }

  if (cmd === "حجر") {
    return solo.startRps(message);
  }

  if (cmd === "نرد") {
    return solo.rollDice(message);
  }

  if (cmd === "بلاكجاك") {
    return blackjack.start(message);
  }

  if (cmd === "xo") {
    return xo.start(message);
  }

  const groupGames = {
    مافيا: "mafia",
    ذئاب: "werewolf",
    روليت: "roulette",
    غميضة: "hide",
    كرسي: "chair",
    تحدي: "challenge",
    اسرع: "fastest",
    تريفيا: "trivia",
    منو: "who"
  };

  if (groupGames[cmd]) {
    return groupLobby.start(message, groupGames[cmd]);
  }
};
