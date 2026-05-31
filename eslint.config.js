// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettier = require("eslint-config-prettier");

module.exports = defineConfig([
    expoConfig,
    prettier,
    {
        ignores: ["dist/*", ".expo/*", "node_modules/*", "uniwind-env.d.ts"],
    },
    {
        // Reanimated's `sharedValue.value = …` mutation is its public API, but the
        // React Compiler immutability rule flags it as mutating a hook result.
        // Scope the exception to the animated UI primitives that use worklets.
        files: ["src/components/ui/BottomSheet.tsx"],
        rules: { "react-hooks/immutability": "off" },
    },
]);
