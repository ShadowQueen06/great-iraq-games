const { EmbedBuilder } = require("discord.js");
const { color } = require("../config.js");
const questions = require("../data/kat_questions.json");
const { addReward } = require("../utils/db.js");
let lastQuestion=null;
function questionEmbed(user){let q;do{q=questions[Math.floor(Math.random()*questions.length)];}while(lastQuestion&&q.id===lastQuestion.id&&questions.length>1);lastQuestion=q;addReward(user,1,1,"kat");return new EmbedBuilder().setColor(color).setTitle("🎭 كت").setDescription(q.question);}
module.exports={questionEmbed};
