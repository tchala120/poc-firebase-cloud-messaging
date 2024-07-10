const fs = require("fs");
const path = require("path");

const src = path.resolve(__dirname, "src");
const directories = fs
  .readdirSync(src, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const importOrder = directories.map((directory) => `^@/${directory}/(.*)$`);

module.exports = {
  endOfLine: "auto",
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: true,
  printWidth: 120,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [...importOrder, "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
