/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: [`@mindedtech`],
  parserOptions: {
    project: `./tsconfig.eslint.json`,
  },
};
