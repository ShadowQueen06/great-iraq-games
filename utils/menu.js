const { EmbedBuilder } = require("discord.js");
const { color } = require("../config.js");
const katQuestions = require("../data/kat_questions.json");
const quizQuestions = require("../data/quiz_questions.json");
const flags = require("../data/flags.json");

function mainMenuEmbed() {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle("🎮 قائمة ألعاب ونسة")
    .setDescription([
      "اكتب أمر اللعبة حتى تبدأ.",
      "",
      "**🎯 ألعاب فردية — متاحة للجميع**",
      "`-كت` `-كويز` `-اعلام` `-رياضيات`",
      "`-تخمين` `-حجر` `-نرد` `-عملة` `-xo @عضو`",
      "",
      "**👥 ألعاب جماعية — تبدأها الإدارة فقط**",
      "`-مافيا` `-ذئاب` `-روليت` `-غميضة`",
      "`-كرسي` `-تحدي` `-اسرع` `-تريفيا` `-منو`",
      "",
      "⏳ لوبي الألعاب الجماعية: **30 ثانية**",
      "",
      `📚 أسئلة كت: **${katQuestions.length}**`,
      `❓ أسئلة عامة: **${quizQuestions.length}**`,
      `🌍 أعلام: **${flags.length}**`,
      "",
      "**📊 الإحصائيات**",
      "استخدم `-بروفايل` أو `-توب` في روم الإحصائيات."
    ].join("\n"));
}

module.exports = { mainMenuEmbed };
