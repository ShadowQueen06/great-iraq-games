const { prefix, statsChannelId } = require("../config.js");
const { mainMenuEmbed } = require("../utils/menu.js");
const xo = require("../games/xo.js");
const kat = require("../games/kat.js");
const quiz = require("../games/quiz.js");
const solo = require("../games/solo.js");
const flags = require("../games/flags.js");
const math = require("../games/math.js");
const coin = require("../games/coin.js");
const groupLobby = require("../games/groupLobby.js");
const profile = require("../games/profile.js");

module.exports = async message => {
  if(message.author.bot||!message.guild||!message.content.startsWith(prefix)) return;
  const cmd=message.content.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase();
  if(cmd==="العاب") return message.reply({embeds:[mainMenuEmbed()]});
  if(["بروفايل","احصائياتي","توب"].includes(cmd)){
    if(message.channel.id!==statsChannelId) return message.reply(`استخدم أوامر الإحصائيات في <#${statsChannelId}>`);
    return message.reply({embeds:[cmd==="توب"?profile.topEmbed():profile.profileEmbed(message.author)]});
  }
  if(cmd==="كت") return message.reply({embeds:[kat.questionEmbed(message.author)],components:kat.menuButtons()});
  if(cmd==="كويز") return message.reply({embeds:[quiz.menuEmbed()],components:quiz.menuButtons()});
  if(cmd==="اعلام") return flags.start(message);
  if(cmd==="رياضيات") return math.start(message);
  if(cmd==="عملة") return coin.start(message);
  if(cmd==="تخمين") return message.reply({embeds:[solo.numberEmbed(message.author)],components:solo.numberButtons()});
  if(cmd==="حجر") return message.reply({embeds:[solo.rpsEmbed()],components:solo.rpsButtons()});
  if(cmd==="نرد") return solo.rollDice(message);
  if(cmd==="xo") return xo.start(message);
  const groups={مافيا:"mafia",ذئاب:"werewolf",روليت:"roulette",غميضة:"hide",كرسي:"chair",تحدي:"challenge",اسرع:"fastest",تريفيا:"trivia",منو:"who"};
  if(groups[cmd]) return groupLobby.start(message,groups[cmd]);
};
