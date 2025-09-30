/**
 * 🔧 PostCSS Configuration
 * Processes CSS with modern tooling and optimizations.
 *
 * Features:
 * - Imports + nesting support
 * - TailwindCSS integration
 * - Autoprefixer for cross-browser support
 * - PostCSS Preset Env for modern CSS features
 * - Production optimizations: cssnano (minification) + PurgeCSS (tree-shaking)
 */

module.exports = {
  plugins: {
    // Import CSS files
    'postcss-import': {},

    // TailwindCSS + nesting support
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},

    // Autoprefix vendor-specific rules
    autoprefixer: {},

    // Enable modern CSS features (with fallbacks)
    'postcss-preset-env': {
      stage: 2,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'custom-media-queries': true,
        'custom-selectors': true,
        'gap-properties': true,
        'overflow-wrap-property': true,
        'place-properties': true,
        'hexadecimal-alpha-notation': true,
        'color-functional-notation': true,
      },
      autoprefixer: { grid: 'autoplace' },
    },

    // Production-only plugins
    ...(process.env.NODE_ENV === 'production'
      ? {
          // CSS Nano → Minify + Optimize
          cssnano: {
            preset: [
              'advanced',
              {
                discardComments: { removeAll: true },
                reduceIdents: true,
                mergeIdents: true,
                mergeRules: true,
                minifyFontValues: true,
                minifyGradients: true,
                minifyParams: true,
                minifySelectors: true,
                normalizeCharset: true,
                normalizeUrl: true,
                removeEmpty: true,
                removeQuotes: true,
                svgo: true,
                zindex: false, // keep z-index as is
                cssDeclarationSorter: { order: 'smacss' },
              },
            ],
          },

          // PurgeCSS → Remove unused Tailwind utilities
          '@fullhuman/postcss-purgecss': {
            content: [
              './index.html',
              './src/**/*.{js,jsx,ts,tsx,vue,html}',
              './node_modules/@headlessui/react/dist/**/*.js',
              './node_modules/react-icons/**/*.js',
            ],
            defaultExtractor: (content) => {
              const broadMatches =
                content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
              const innerMatches =
                content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
              return broadMatches.concat(innerMatches);
            },
            safelist: {
              standard: [
                // Keep common Tailwind utilities
                /^(bg|text|border)-(red|green|blue|yellow|purple|pink|gray|indigo)/,
                /^(hover|focus|active|disabled|group-hover):/,
                /^(dark):/,
                /^(sm|md|lg|xl|2xl):/,
                'html',
                'body',
              ],
              deep: [/tippy/, /tooltip/, /modal/, /dropdown/],
              greedy: [/^animate-/],
            },
          },
        }
      : {}),
  },
};
