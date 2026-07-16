const kat=require("../games/kat.js");
const quiz=require("../games/quiz.js");
const xo=require("../games/xo.js");
const solo=require("../games/solo.js");
const groupLobby=require("../games/groupLobby.js");
module.exports=async interaction=>{try{if(!interaction.isButton())return;if(interaction.customId.startsWith("lobby_"))return groupLobby.handleButton(interaction);if(interaction.customId.startsWith("xo_"))return xo.handleButton(interaction);if(interaction.customId.startsWith("quiz_")||interaction.customId==="quiz_start")return quiz.handleButton(interaction);if(interaction.customId.startsWith("solo_"))return solo.handleButton(interaction);if(interaction.customId==="kat_new")return interaction.update({embeds:[kat.questionEmbed(interaction.user)],components:kat.menuButtons()});if(interaction.customId==="close")return interaction.update({content:"تم إغلاق القائمة.",embeds:[],components:[]});}catch(e){console.error("Interaction error:",e);if(!interaction.replied&&!interaction.deferred)interaction.reply({content:"صار خطأ.",ephemeral:true}).catch(()=>{});}};
