import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error', // Report Prettier errors as ESLint errors
      // Add any custom ESLint rules here
    },
  },
  prettierConfig, // Must be last to disable conflicting rules
  {
    ignores: ['node_modules', 'build', 'dist'], // Add build artifacts to ignore
  }
);
