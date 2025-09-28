import eslintPluginTs from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        files: ["**/*.ts", "**/*.js"],
        ignores: ["dist/**", "node_modules/**"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module"
            }
        },
        plugins: {
            "@typescript-eslint": eslintPluginTs
        },
        rules: {
            semi: ["error", "always"],
            quotes: ["error", "double"],
            "@typescript-eslint/no-unused-vars": "warn"
        }
    },
    {
        files: ["src/generated/**"],
        rules: {
            "@typescript-eslint/no-unused-vars": "off"
        }
    }
];
