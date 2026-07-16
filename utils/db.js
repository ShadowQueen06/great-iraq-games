const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../data/players.json");
function readData(){ if(!fs.existsSync(filePath)) fs.writeFileSync(filePath,"{}","utf8"); try{return JSON.parse(fs.readFileSync(filePath,"utf8")||"{}");}catch{return{};} }
function writeData(data){ fs.writeFileSync(filePath,JSON.stringify(data,null,2),"utf8"); }
function defaultPlayer(user){return {id:user.id,name:user.username||`Player-${user.id.slice(-4)}`,coins:0,xp:0,level:1,wins:0,losses:0,games:0,points:0,winStreak:0,bestWinStreak:0,stats:{kat:0,quizCorrect:0,quizWrong:0,xoWins:0,soloWins:0,flagsWins:0,mathWins:0,groupWins:0}};}
function getPlayer(user){const data=readData(); if(!data[user.id]) data[user.id]=defaultPlayer(user); data[user.id].name=user.username||data[user.id].name; writeData(data); return data[user.id];}
function savePlayer(player){const data=readData(); data[player.id]=player; writeData(data);}
function xpNeeded(level){return level*100;}
function addReward(user,coins,xp,statName=null){const p=getPlayer(user);p.coins+=coins;p.xp+=xp;if(statName){p.stats[statName]=(p.stats[statName]||0)+1;}while(p.xp>=xpNeeded(p.level)){p.xp-=xpNeeded(p.level);p.level++;}savePlayer(p);return p;}
function addGameResult(user,{win=false,lose=false,points=0,coins=0,xp=0,stat=null}={}){const p=getPlayer(user);p.games++;p.points+=points;p.coins+=coins;p.xp+=xp;if(win){p.wins++;p.winStreak++;p.bestWinStreak=Math.max(p.bestWinStreak,p.winStreak);}if(lose){p.losses++;p.winStreak=0;}if(stat)p.stats[stat]=(p.stats[stat]||0)+1;while(p.xp>=xpNeeded(p.level)){p.xp-=xpNeeded(p.level);p.level++;}savePlayer(p);return p;}
function getTopPlayers(limit=10){return Object.values(readData()).sort((a,b)=>(b.points-a.points)||(b.wins-a.wins)||(b.level-a.level)).slice(0,limit);}
module.exports={getPlayer,savePlayer,addReward,addGameResult,getTopPlayers,xpNeeded};
