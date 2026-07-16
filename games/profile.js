const { EmbedBuilder } = require("discord.js");
const { color } = require("../config.js");
const { getPlayer, getTopPlayers, xpNeeded } = require("../utils/db.js");
function profileEmbed(user){const p=getPlayer(user);return new EmbedBuilder().setColor(color).setTitle("🎮 إحصائيات الألعاب").setThumbnail(user.displayAvatarURL?.({size:256})||null).setDescription([`👤 ${user.username}`,"",`🏆 مرات الفوز: **${p.wins}**`,`❌ مرات الخسارة: **${p.losses}**`,`🎮 عدد الألعاب: **${p.games}**`,`🥇 أعلى سلسلة انتصارات: **${p.bestWinStreak}**`,`⭐ نقاط الألعاب: **${p.points}**`,"",`🏅 المستوى: **${p.level}**`,`✨ XP: **${p.xp} / ${xpNeeded(p.level)}**`,`🪙 العملات: **${p.coins}**`].join("\n"));}
function topEmbed(){const ps=getTopPlayers(10);return new EmbedBuilder().setColor(color).setTitle("🏆 توب الألعاب").setDescription(ps.length?ps.map((p,i)=>`**${i+1}.** ${p.name} — ⭐ ${p.points} | 🏆 ${p.wins}`).join("\n"):"لا توجد بيانات بعد.");}
module.exports={profileEmbed,topEmbed};
