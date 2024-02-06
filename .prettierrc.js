module.exports = {
  overrides: [
    {
      files: "*.ts",
      options: {
        tabWidth: 4,
        singleQuote: true,
        trailingComma: "none",
      },
    },
    {
      files: "*.json",
      options: {
        trailingComma: "none",
      },
    },
  ],
};
