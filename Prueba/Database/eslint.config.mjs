import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import prettier from "eslint-plugin-prettier";

export default defineConfig([
	js.configs.recommended,
	...tseslint.configs.recommended,

	prettier,

	{
		files: ["**/*.{ts,js}"],
		languageOptions: {
			globals: {
				...globals.node
			}
		},
		plugins: {
			unicorn
		},
		rules: {
			...unicorn.configs.recommended.rules,

			"no-console": "off",
			"prefer-const": "error",
			"no-var": "error",

			"unicorn/prefer-module": "off"
		}
	}
]);