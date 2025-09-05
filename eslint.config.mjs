import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable unused variable warnings
      "@typescript-eslint/no-unused-vars": "off",

      // Disable missing dependency warnings in useEffect
      "react-hooks/exhaustive-deps": "off",

      // Disable prefer-const warnings
      "prefer-const": "off",

      // Disable next.js <img> linting if you want
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
