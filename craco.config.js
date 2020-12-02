module.exports = {
  babel: {
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            _: "./src",
          },
        },
      ],
    ],
  },
};
