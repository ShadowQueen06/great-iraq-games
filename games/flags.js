const { EmbedBuilder } = require("discord.js");
const { color, rewards } = require("../config.js");
const flags = require("../data/flags.json");
const { addGameResult } = require("../utils/db.js");

const active = new Map();

function normalize(text) {
  return text.trim().toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
}

async function start(message) {
  if (active.has(message.channel.id)) return message.reply("أكو لعبة أعلام شغالة بهذا الروم.");
  const item = flags[Math.floor(Math.random() * flags.length)];
  active.set(message.channel.id, item);

  await message.reply({
    embeds: [new EmbedBuilder().setColor(color).setTitle("🌍 أعلام").setDescription(`${item.flag}\n\nشنو اسم هاي الدولة؟\n⏳ عندكم **15 ثانية**.`)]
  });

  const collector = message.channel.createMessageCollector({
    filter: m => !m.author.bot,
    time: 15000
  });

  collector.on("collect", m => {
    const answer = normalize(m.content);
    if (item.answers.some(a => normalize(a) === answer)) {
      collector.stop("winner");
      addGameResult(m.author, { win: true, points: 10, coins: rewards.soloCoins, xp: rewards.soloXp, stat: "flagsWins" });
      m.reply(`✅ صح! الجواب **${item.name}** ${item.flag}`);
    }
  });

  collector.on("end", (_, reason) => {
    active.delete(message.channel.id);
    if (reason !== "winner") message.channel.send(`⌛ انتهى الوقت. الجواب: **${item.name}** ${item.flag}`);
  });
}

module.exports = { start };
