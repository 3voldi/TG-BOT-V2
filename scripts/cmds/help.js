module.exports = {
  nix: {
    name: "help",
    prefix: false,
    role: 0,
    category: "utility",
    aliases: ["commands"],
    author: "ArYAN",
    version: "0.0.1",
  },

  async onStart({ message, args }) {
    if (!global.teamnix || !global.teamnix.cmds) {
      return message.reply("Command collection is not available.");
    }
    const commands = global.teamnix.cmds;

    // Si une commande spécifique est demandée
    if (args.length) {
      const query = args[0].toLowerCase();
      const cmd = [...commands.values()].find(
        (c) =>
          c.nix.name === query ||
          (c.nix.aliases && c.nix.aliases.includes(query))
      );
      if (!cmd) return message.reply(`No command called “${query}”.`);
      const info = cmd.nix;
      const detail = `
╭─────────────────────◊
│ ▸ Command: ${info.name}
│ ▸ Aliases: ${
        info.aliases?.length ? info.aliases.join(", ") : "None"
      }
│ ▸ Can use: ${
        info.role === 2 ? "Admin Only" : info.role === 1 ? "VIP Only" : "All Users"
      }
│ ▸ Category: ${info.category?.toUpperCase() || "UNCATEGORIZED"}
│ ▸ PrefixEnabled?: ${info.prefix === false ? "False" : "True"}
│ ▸ Author: ${info.author || "Unknown"}
│ ▸ Version: ${info.version || "N/A"}
╰─────────────────────◊
      `.trim();
      return message.reply(detail);
    }

    // Sinon afficher la liste complète formatée par catégorie (avec le style demandé)
    const cats = {};
    [...commands.values()]
      .filter(
        (command, index, self) =>
          index === self.findIndex((c) => c.nix.name === command.nix.name)
      )
      .forEach((c) => {
        const cat = c.nix.category || "UNCATEGORIZED";
        if (!cats[cat]) cats[cat] = [];
        if (!cats[cat].includes(c.nix.name)) cats[cat].push(c.nix.name);
      });

    // Exemple mapping catégories vers titres décorés + emoji, tu peux modifier à ta guise
    const catTitles = {
      media: "𝗠𝗲𝗱𝗶𝗮",
      utility: "𝗨𝘁𝗶𝗹𝗶𝘁𝘆",
      info: "𝗜𝗻𝗳𝗼",
      boxchat: "𝗕𝗼𝘅 𝗰𝗵𝗮𝘁",
      owner: "𝗢𝘄𝗻𝗲𝗿",
      ai: "𝗔𝗶",
      image: "𝗜𝗺𝗮𝗴𝗲",
      search: "𝗦𝗲𝗮𝗿𝗰𝗵",
      support: "𝗦𝘂𝗽𝗽𝗼𝗿𝘁",
      game: "𝗚𝗮𝗺𝗲",
    };

    let msg = "📜 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁\n\n";

    // Tri alphabétique des catégories
    Object.keys(cats)
      .sort()
      .forEach((cat) => {
        const title = catTitles[cat.toLowerCase()] || cat.toUpperCase();
        msg += `╭─────『 ${title} 』\n`;

        // Ici tu peux mettre un emoji ✿ devant chaque commande comme demandé
        cats[cat]
          .sort()
          .forEach((cmdName) => {
            msg += `✿ ${cmdName}   `;
          });

        msg += "\n╰──────────────\n\n";
      });

    msg += `
╭──────────────◊
│ » Total commands: ${[...new Set(commands.values())].length}
│ » A Powerful Telegram bot
│ » ۝𝐶𝐻𝑅𝐼𝑆𝑇𝑈𝑆
╰──────────◊
「 𝑉𝑜𝑖𝑑 𝐵𝑜𝑡 」
    `.trim();

    await message.reply(msg);
  },
};
