const { EmbedBuilder } = require("discord.js");
const { color } = require("../config.js");
async function start(message) {
  const result = Math.random() < 0.5 ? "صورة" : "كتابة";
  return message.reply({ embeds: [new EmbedBuilder().setColor(color).setTitle("🪙 قلب العملة").setDescription(`النتيجة: **${result}**`)] });
}
module.exports = { start };
