const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { color } = require("../config.js");
const { addGameResult } = require("../utils/db.js");

const lobbies = new Map();
const NAMES = {
  mafia: ["🎭", "مافيا", 4], werewolf: ["🐺", "ذئاب", 4], roulette: ["🎲", "روليت", 3], hide: ["🙈", "غميضة", 3],
  chair: ["🪑", "كرسي ساخن", 3], challenge: ["⚔️", "تحدي", 2], fastest: ["⚡", "أسرع كتابة", 2], trivia: ["🧠", "تريفيا جماعي", 2], who: ["🎭", "منو", 2]
};

function rows(id) {
  return [new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`lobby_join:${id}`).setLabel("انضمام").setEmoji("✅").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`lobby_leave:${id}`).setLabel("خروج").setEmoji("❌").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`lobby_cancel:${id}`).setLabel("إلغاء").setEmoji("🛑").setStyle(ButtonStyle.Danger)
  )];
}

function embed(lobby, remaining = 30) {
  const [emoji, name, min] = NAMES[lobby.type];
  const list = lobby.players.size ? [...lobby.players].map((id, i) => `${i + 1}. <@${id}>`).join("\n") : "لا يوجد لاعبين بعد.";
  return new EmbedBuilder().setColor(color).setTitle(`${emoji} ${name}`).setDescription(`اضغط **انضمام** للمشاركة.\n\n${list}\n\n👥 العدد: **${lobby.players.size}**\n📌 الحد الأدنى: **${min}**\n⏳ تبدأ بعد: **${remaining} ثانية**`);
}

async function start(message, type) {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply("❌ الألعاب الجماعية تبدأها الإدارة فقط.");
  if (lobbies.has(message.channel.id)) return message.reply("أكو لوبي جماعي مفتوح بهذا الروم.");
  const id = `${message.channel.id}-${Date.now()}`;
  const lobby = { id, type, hostId: message.author.id, players: new Set([message.author.id]), channelId: message.channel.id, message: null, interval: null };
  lobbies.set(message.channel.id, lobby);
  lobby.message = await message.reply({ embeds: [embed(lobby)], components: rows(id) });
  let remaining = 30;
  lobby.interval = setInterval(async () => {
    remaining -= 5;
    if (remaining > 0) return lobby.message.edit({ embeds: [embed(lobby, remaining)], components: rows(id) }).catch(() => {});
    clearInterval(lobby.interval);
    lobbies.delete(message.channel.id);
    const min = NAMES[type][2];
    if (lobby.players.size < min) return lobby.message.edit({ content: "❌ ما اكتمل عدد اللاعبين، انلغت اللعبة.", embeds: [], components: [] });
    await lobby.message.edit({ embeds: [new EmbedBuilder().setColor("#2ECC71").setTitle(`${NAMES[type][0]} بدأت ${NAMES[type][1]}`).setDescription([...lobby.players].map(id => `<@${id}>`).join("\n"))], components: [] });
    runGame(message.channel, lobby);
  }, 5000);
}

async function runGame(channel, lobby) {
  const players = [...lobby.players];
  if (lobby.type === "roulette") {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const winner = shuffled[0];
    addGameResult({ id: winner, username: `Player-${winner.slice(-4)}` }, { win: true, points: 25, coins: 20, xp: 15, stat: "groupWins" });
    return channel.send(`🎲 دارت الروليت... الفائز هو <@${winner}>!`);
  }
  if (lobby.type === "hide") {
    const places = ["🌳 الشجرة", "🏠 البيت", "🚗 السيارة", "🌊 البحر", "🏰 القلعة", "🌋 الجبل", "🚢 السفينة", "🌌 الفضاء"];
    const scores = players.map(id => ({ id, score: Math.floor(Math.random() * players.length) }));
    const max = Math.max(...scores.map(x => x.score));
    const winners = scores.filter(x => x.score === max);
    winners.forEach(w => addGameResult({ id: w.id, username: `Player-${w.id.slice(-4)}` }, { win: true, points: 20, coins: 15, xp: 10, stat: "groupWins" }));
    return channel.send(`🙈 انتهت الغميضة!\n${scores.sort((a,b)=>b.score-a.score).map((x,i)=>`${i+1}. <@${x.id}> — ${x.score} اكتشاف`).join("\n")}\n\nالأماكن المستخدمة: ${places.slice(0, Math.min(players.length, places.length)).join("، ")}`);
  }
  return channel.send(`✅ بدأت اللعبة. الإدارة تدير جولة **${NAMES[lobby.type][1]}** بين اللاعبين المذكورين.`);
}

async function handleButton(interaction) {
  if (!interaction.isButton() || !interaction.customId.startsWith("lobby_")) return false;
  const [action, id] = interaction.customId.split(":");
  const lobby = lobbies.get(interaction.channel.id);
  if (!lobby || lobby.id !== id) return interaction.reply({ content: "هذا اللوبي انتهى.", ephemeral: true });
  if (action === "lobby_join") lobby.players.add(interaction.user.id);
  if (action === "lobby_leave") lobby.players.delete(interaction.user.id);
  if (action === "lobby_cancel") {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: "الإدارة فقط تكدر تلغي.", ephemeral: true });
    clearInterval(lobby.interval); lobbies.delete(interaction.channel.id);
    return interaction.update({ content: "🛑 تم إلغاء اللعبة.", embeds: [], components: [] });
  }
  return interaction.update({ embeds: [embed(lobby)], components: rows(id) });
}

module.exports = { start, handleButton };
