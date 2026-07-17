const { EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle }=require("discord.js");
const { color,rewards }=require("../config.js");
const questions=require("../data/quiz_questions.json");
const { addReward }=require("../utils/db.js");
let lastQuestionId=null;
function randomQuestion(){let q;do{q=questions[Math.floor(Math.random()*questions.length)];}while(q.id===lastQuestionId&&questions.length>1);lastQuestionId=q.id;return q;}
function questionEmbed(q){return new EmbedBuilder().setColor(color).setTitle("❓ كويز").setDescription(`${q.question}

A) ${q.answers[0]}
B) ${q.answers[1]}
C) ${q.answers[2]}
D) ${q.answers[3]}`);}
function answerButtons(q){return [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`quiz_answer_${q.id}_0`).setLabel("A").setStyle(ButtonStyle.Primary),new ButtonBuilder().setCustomId(`quiz_answer_${q.id}_1`).setLabel("B").setStyle(ButtonStyle.Primary),new ButtonBuilder().setCustomId(`quiz_answer_${q.id}_2`).setLabel("C").setStyle(ButtonStyle.Primary),new ButtonBuilder().setCustomId(`quiz_answer_${q.id}_3`).setLabel("D").setStyle(ButtonStyle.Primary))];}
function start(message){const q=randomQuestion();return message.reply({embeds:[questionEmbed(q)],components:answerButtons(q)});}
async function handleButton(interaction){if(!interaction.customId.startsWith("quiz_answer_"))return false;const p=interaction.customId.split("_");const q=questions.find(x=>x.id===Number(p[2]));if(!q)return interaction.reply({content:"السؤال غير موجود.",ephemeral:true});const ok=Number(p[3])===q.correct;if(ok)addReward(interaction.user,rewards.quizCorrectCoins,rewards.quizCorrectXp,"quizCorrect");else addReward(interaction.user,0,0,"quizWrong");return interaction.update({embeds:[new EmbedBuilder().setColor(ok?"#2ECC71":"#E74C3C").setTitle("❓ كويز").setDescription(ok?`✅ صح! الجواب **${q.answers[q.correct]}**`:`❌ خطأ. الجواب **${q.answers[q.correct]}**`)],components:[]});}
module.exports={start,handleButton};
