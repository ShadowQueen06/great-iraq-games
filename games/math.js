const { EmbedBuilder } = require("discord.js");
const { color, rewards } = require("../config.js");
const { addGameResult } = require("../utils/db.js");
const active = new Map();

function makeQuestion() {
  const level = Math.random();
  let a, b, op, answer;
  if (level < 0.4) {
    a = Math.floor(Math.random() * 90) + 10; b = Math.floor(Math.random() * 90) + 10; op = Math.random() < 0.5 ? "+" : "-"; answer = op === "+" ? a + b : a - b;
  } else if (level < 0.8) {
    a = Math.floor(Math.random() * 20) + 2; b = Math.floor(Math.random() * 15) + 2; op = "×"; answer = a * b;
  } else {
    b = Math.floor(Math.random() * 12) + 2; answer = Math.floor(Math.random() * 20) + 2; a = b * answer; op = "÷";
  }
  return { text: `${a} ${op} ${b}`, answer };
}

async function start(message) {
  if (active.has(message.channel.id)) return message.reply("أكو لعبة رياضيات شغالة بهذا الروم.");
  const q = makeQuestion();
  active.set(message.channel.id, q);
  await message.reply({ embeds: [new EmbedBuilder().setColor(color).setTitle("➕ رياضيات").setDescription(`احسب الناتج:\n\n**${q.text} = ؟**\n\n⏳ عندكم **20 ثانية**.`)] });
  const collector = message.channel.createMessageCollector({ filter: m => !m.author.bot, time: 20000 });
  collector.on("collect", m => {
    if (Number(m.content.trim()) === q.answer) {
      collector.stop("winner");
      addGameResult(m.author, { win: true, points: 10, coins: rewards.soloCoins, xp: rewards.soloXp, stat: "mathWins" });
      m.reply(`✅ صح! الناتج **${q.answer}**`);
    }
  });
  collector.on("end", (_, reason) => {
    active.delete(message.channel.id);
    if (reason !== "winner") message.channel.send(`⌛ انتهى الوقت. الناتج الصحيح: **${q.answer}**`);
  });
}
module.exports = { start };
