const fs = require("fs");

fs.mkdirSync(__dirname + "/../src/assets/contracts/core/", { recursive: true });

const MintableMappedMetadataNFT = fs.readFileSync(
  __dirname + "/../../contracts/MintableMappedMetadataNFT.aes",
  "utf-8"
);
fs.writeFileSync(
  __dirname + "/../src/assets/contracts/MintableMappedMetadataNFT.aes.js",
  `module.exports = \`\n${MintableMappedMetadataNFT.replace(/`/g, "\\`")}\`;\n`,
  "utf-8"
);

const coreUtils = fs.readFileSync(
  __dirname + "/../../contracts/core/utils.aes",
  "utf-8"
);
fs.writeFileSync(
  __dirname + "/../src/assets/contracts/core/utils.aes.js",
  `module.exports = \`\n${coreUtils.replace(/`/g, "\\`")}\`;\n`,
  "utf-8"
);

const coreIAEX141NFTReceiver = fs.readFileSync(
  __dirname + "/../../contracts/core/IAEX141NFTReceiver.aes",
  "utf-8"
);
fs.writeFileSync(
  __dirname + "/../src/assets/contracts/core/IAEX141NFTReceiver.aes.js",
  `module.exports = \`\n${coreIAEX141NFTReceiver.replace(/`/g, "\\`")}\`;\n`,
  "utf-8"
);
