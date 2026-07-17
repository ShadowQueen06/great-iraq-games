const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const {
  color,
  rewards
} = require("../config.js");

const {
  addReward
} = require("../utils/db.js");

const numberGames = new Map();

function numberEmbed(user) {
  const number = Math.floor(Math.random() * 5) + 1;

  numberGames.set(user.id, number);

  return new EmbedBuilder()
    .setColor(color)
    .setTitle("🎯 تخمين الرقم")
    .setDescription("اختار رقم من **1 إلى 5**.");
}

function numberButtons() {
  return [
    new ActionRowBuilder().addComponents(
      ...[1, 2, 3, 4, 5].map(number =>
        new ButtonBuilder()
          .setCustomId(`solo_guess_${number}`)
          .setLabel(String(number))
          .setStyle(ButtonStyle.Primary)
      )
    )
  ];
}

function rpsEmbed() {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle("🪨 حجر ورقة مقص")
    .setDescription("اختار حركتك.");
}

function rpsButtons() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("solo_rps_rock")
        .setLabel("حجر")
        .setEmoji("🪨")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("solo_rps_paper")
        .setLabel("ورقة")
        .setEmoji("📄")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("solo_rps_scissors")
        .setLabel("مقص")
        .setEmoji("✂️")
        .setStyle(ButtonStyle.Primary)
    )
  ];
}

async function handleButton(interaction) {
  const id = interaction.customId;

  if (id.startsWith("solo_guess_")) {
    const guess = Number(id.split("_")[2]);
    const realNumber = numberGames.get(interaction.user.id);

    if (!realNumber) {
      return interaction.reply({
        content: "هاي الجولة انتهت. اكتب `-تخمين` حتى تبدأ جولة جديدة.",
        ephemeral: true
      });
    }

    const win = guess === realNumber;

    numberGames.delete(interaction.user.id);

    if (win) {
      addReward(
        interaction.user,
        rewards.soloCoins,
        rewards.soloXp,
        "soloWins"
      );
    }

    return interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor(win ? "#2ECC71" : "#E74C3C")
          .setTitle("🎯 تخمين الرقم")
          .setDescription(
            win
              ? `✅ صح! الرقم كان **${realNumber}**`
              : `❌ خطأ. الرقم كان **${realNumber}**`
          )
      ],
      components: []
    });
  }

  if (id.startsWith("solo_rps_")) {
    const choices = ["rock", "paper", "scissors"];

    const names = {
      rock: "حجر",
      paper: "ورقة",
      scissors: "مقص"
    };

    const userChoice = id.split("_")[2];
    const botChoice =
      choices[Math.floor(Math.random() * choices.length)];

    let result = "draw";

    if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    ) {
      result = "win";
    } else if (userChoice !== botChoice) {
      result = "lose";
    }

    if (result === "win") {
      addReward(
        interaction.user,
        rewards.soloCoins,
        rewards.soloXp,
        "soloWins"
      );
    }

    let resultText = "تعادل!";

    if (result === "win") {
      resultText = "✅ فزت!";
    }

    if (result === "lose") {
      resultText = "❌ خسرت.";
    }

    return interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor(
            result === "win"
              ? "#2ECC71"
              : result === "lose"
                ? "#E74C3C"
                : color
          )
          .setTitle("🪨 حجر ورقة مقص")
          .setDescription(
            [
              `اختيارك: **${names[userChoice]}**`,
              `اختيار البوت: **${names[botChoice]}**`,
              "",
              resultText
            ].join("\n")
          )
      ],
      components: []
    });
  }

  return false;
}

async function rollDice(message) {
  const userRoll = Math.floor(Math.random() * 6) + 1;
  const botRoll = Math.floor(Math.random() * 6) + 1;

  const win = userRoll > botRoll;
  const draw = userRoll === botRoll;

  if (win) {
    addReward(
      message.author,
      rewards.soloCoins,
      rewards.soloXp,
      "soloWins"
    );
  }

  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(
          win
            ? "#2ECC71"
            : draw
              ? color
              : "#E74C3C"
        )
        .setTitle("🎲 رمي النرد")
        .setDescription(
          [
            `أنت رميت: **${userRoll}**`,
            `البوت رمى: **${botRoll}**`,
            "",
            win
              ? "✅ فزت!"
              : draw
                ? "تعادل!"
                : "❌ خسرت."
          ].join("\n")
        )
    ]
  });
}

module.exports = {
  handleButton,
  numberEmbed,
  numberButtons,
  rpsEmbed,
  rpsButtons,
  rollDice
};
