module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": ["eslint:recommended",
		"prettier",
		"plugin:import/errors",
		"plugin:import/warnings"],
	"plugins": ["eslint-plugin-no-comments", "@stylistic/js", "react"],
	"overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "globals": {
        "require": true,
        "process": true,
        "module": true
      },
      "rules": {
        "no-unreachable": "error",
        "no-func-assign": "error",
        "no-undef": "error",
        "no-empty": "error",
        "no-console": ["error", { "allow": ["warn", "error", "info"] }],
        "@stylistic/js/keyword-spacing": ["error", { "before": true }],
        "@stylistic/js/key-spacing": ["error", { "beforeColon": false }],
        "@stylistic/js/block-spacing": "error",
        "@stylistic/js/arrow-spacing": "error",
        "@stylistic/js/space-before-blocks": "error",
        "@stylistic/js/brace-style": "error",
        "@stylistic/js/comma-dangle": ["error", "never"],
        "@stylistic/js/comma-spacing": ["error", { "before": false, "after": true }],
        "@stylistic/js/function-call-spacing": ["error", "never"],
        // "@stylistic/js/max-len": ["error", { "code": 100, "ignoreStrings": true }],
        "@stylistic/js/max-statements-per-line": ["error", { "max": 1 }],
        "@stylistic/js/no-extra-semi": "error",
        "@stylistic/js/no-mixed-operators": "error",
        "@stylistic/js/no-mixed-spaces-and-tabs": "error",
        "@stylistic/js/no-multi-spaces": "error",
        "@stylistic/js/no-multiple-empty-lines": "error",
        "@stylistic/js/no-trailing-spaces": "error",
        // "@stylistic/js/semi": ["error", "always"],
        "@stylistic/js/semi-spacing": "error",
        "@stylistic/js/space-infix-ops": "error",
        "@stylistic/js/space-unary-ops": "error",
        "camelcase": "error",
        "prefer-const": ["error", { "destructuring": "all", "ignoreReadBeforeAssign": true }],
        // "no-comments/disallowComments": ["error", {"allow": ["NOTE:", "TODO:", "INFO:", "eslint"]}],
        // "@stylistic/js/indent": ["error", "tab"],
        "import/extensions": ["error", "never"],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/prop-types": 0,
        "import/no-cycle": ["off", { "maxDepth": null }],
        "import/order": ["error", {
            "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
            "warnOnUnassignedImports": true,
            "alphabetize": {
                "order": "asc",
                "caseInsensitive": true
            }
        }]
    },
    "ignorePatterns": ['rough', '*.test.js']
}
