// CommonJS PostCSS config — most compatible format for Tailwind v3 + autoprefixer.
// Using .cjs avoids ESM/CJS ambiguity under "type": "module" in package.json.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};