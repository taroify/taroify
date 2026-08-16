module.exports = {
  extends: ["stylelint-config-recommended-scss", "stylelint-config-recess-order"],
  rules: {
    // Empty double-slash comments are used as visual separators in legacy variables files.
    "scss/comment-no-empty": null,
    // The SCSS parser treats the slashes in unquoted URLs as division operators.
    "scss/operator-no-unspaced": null,
    "selector-no-qualifying-type": [
      true,
      {
        ignore: ["attribute", "class", "id"],
      },
    ],
    "selector-max-compound-selectors": 5,
    "selector-type-no-unknown": [
      true,
      {
        ignoreTypes: ["/^taro-/", "page"],
      },
    ],
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["host", "global"],
      },
    ],
    "selector-class-pattern": null,
    "scss/selector-class-pattern": [
      "^[a-z][a-z0-9-]*(?:(?:--|__|_)[a-z0-9-]+)*$",
      {
        resolveNestedSelectors: true,
      },
    ],
    "max-nesting-depth": [
      5,
      {
        ignoreAtRules: ["each", "media", "supports", "include"],
      },
    ],
  },
}
