const { EmbedBuilder }=require("discord.js");
const { color,rewards }=require("../config.js");
const flags=require("../data/flags.json");
const { addGameResult }=require("../utils/db.js");
const active=new Map();
function normalize(t){return t.trim().toLowerCase().replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي");}
function emojiToCode(flag){return [...flag].map(c=>String.fromCharCode(c.codePointAt(0)-127397)).join("").toLowerCase();}
async function start(message){if(active.has(message.channel.id))return message.reply("أكو لعبة أعلام شغالة بهذا الروم.");const item=flags[Math.floor(Math.random()*flags.length)];active.set(message.channel.id,item);const code=emojiToCode(item.flag);await message.reply({embeds:[new EmbedBuilder().setColor(color).setTitle("🌍 أعلام").setDescription(`شنو اسم هاي الدولة؟\n⏳ عندكم **15 ثانية**.`).setImage(`https://flagcdn.com/w640/${code}.png`)]});const collector=message.channel.createMessageCollector({filter:m=>!m.author.bot,time:15000});collector.on("collect",m=>{const a=normalize(m.content);if(item.answers.some(x=>normalize(x)===a)){collector.stop("winner");addGameResult(m.author,{win:true,points:10,coins:rewards.soloCoins,xp:rewards.soloXp,stat:"flagsWins"});m.reply(`✅ صح! الجواب **${item.name}**`);}});collector.on("end",(_,r)=>{active.delete(message.channel.id);if(r!=="winner")message.channel.send(`⌛ انتهى الوقت. الجواب: **${item.name}**`);});}
module.exports={start};
