const { EmbedBuilder } = require("discord.js");
const { color, statsChannelId } = require("../config.js");
function mainMenuEmbed() {
  return new EmbedBuilder().setColor(color).setTitle("🎮 قائمة ألعاب GI")
    .setDescription([
      "اكتب أمر اللعبة حتى تبدأ.","",
      "**🎯 ألعاب فردية — متاحة للجميع**",
      "`-كت` `-كويز` `-اعلام` `-عواصم` `-دول`",
      "`-عملات` `-رياضيات` `-تخمين` `-صح` `-ترتيب`",
      "`-حجر` `-نرد` `-بلاكجاك` `-xo @عضو`","",
      "**👥 ألعاب جماعية — تبدأها الإدارة فقط**",
      "`-مافيا` `-ذئاب` `-روليت` `-غميضة`",
      "`-كرسي` `-تحدي` `-اسرع` `-تريفيا` `-منو`","",
      "⏳ لوبي الألعاب الجماعية: **30 ثانية**","",
      "**📊 الإحصائيات**",
      `استخدم \`-بروفايل\` أو \`-توب\` في <#${statsChannelId}>.`
    ].join("\n"));
}
module.exports={mainMenuEmbed};
