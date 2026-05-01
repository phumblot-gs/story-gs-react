/**
 * @gs/gs-components-library — Tailwind preset
 *
 * Extends a consumer's Tailwind config with the GS design-system theme:
 * spacing scale (5 px increments), font families, the full color palette
 * (Figma tokens + semantic state / grade / flag colors), border radius,
 * font sizes / weights / line-heights, and the keyframes / animations
 * used by Radix-based components.
 *
 * Usage in a consumer project:
 *
 * ```js
 * // tailwind.config.{js,cjs}
 * /** @type {import('tailwindcss').Config} *\/
 * module.exports = {
 *   presets: [require('@gs/gs-components-library/tailwind-preset')],
 *   content: ['./src/**\/*.{ts,tsx,js,jsx}'],
 *   // ... project-specific extensions
 * };
 * ```
 *
 * Note: this preset uses `tailwindcss-animate` as a plugin. Make sure it's
 * installed in the consumer project (`npm install tailwindcss-animate`).
 *
 * If you only use the lib's pre-built components AND import
 * `@gs/gs-components-library/styles`, you do NOT need this preset — the
 * compiled CSS already contains every utility class used by the components.
 * The preset is only useful if you build your own components on top of the
 * GS theme tokens.
 */

/** @type {Partial<import('tailwindcss').Config>} */
module.exports = {
  darkMode: ["class"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Spacing personnalisé basé sur la charte (incréments de 5 px)
      spacing: {
        "0": "0rem",
        "1": "0.3125rem", // 5px
        "2": "0.625rem", // 10px
        "3": "0.9375rem", // 15px
        "4": "1.25rem", // 20px
        "5": "1.5625rem", // 25px
        "6": "1.875rem", // 30px
        "8": "2.5rem", // 40px
        "10": "3.125rem", // 50px
        "12": "3.75rem", // 60px
        "16": "5rem", // 80px
        "20": "6.25rem", // 100px
        "24": "7.5rem", // 120px
        "28": "8.75rem", // 140px
        "30": "9.375rem", // 150px
        "32": "10rem", // 160px
        "36": "11.25rem", // 180px
        "40": "12.5rem", // 200px
        "44": "13.75rem", // 220px
        "48": "15rem", // 240px
        "50": "15.625rem", // 250px
        "52": "16.25rem", // 260px
        "56": "17.5rem", // 280px
        "60": "18.75rem", // 300px
        "64": "20rem", // 320px
        "68": "21.25rem", // 340px
        "70": "21.875rem", // 350px
        "72": "22.5rem", // 360px
        "80": "25rem", // 400px
        "90": "28.125rem", // 450px
        "100": "31.25rem", // 500px
        // Semantic tokens
        header: {
          height: "var(--header-height)",
          "pd-main-h": "var(--header-pd-main-h)",
          "pd-main-v": "var(--header-pd-main-v)",
          "pd-bloc-h": "var(--header-pd-bloc-h)",
        },
        button: {
          "header-size": "var(--button-header-size)",
          "pd-header": "var(--button-pd-header)",
          "radius-header": "var(--button-radius-header)",
        },
        padding: {
          small: "var(--padding-small)",
          medium: "var(--padding-medium)",
          large: "var(--padding-large)",
          xlarge: "var(--padding-xlarge)",
          xxlarge: "var(--padding-xxlarge)",
          xxxlarge: "var(--padding-xxxlarge)",
        },
      },
      fontFamily: {
        sans: ["var(--gs-font-sans, AvenirNextLTPro)", "ui-sans-serif", "system-ui", "sans-serif"],
        custom: ["AvenirNextLTPro", "sans-serif"],
        avenir: ["AvenirNextLTPro", "sans-serif"],
        mono: ["var(--gs-font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "header-gradient-start": "var(--header-gradient-start, #74D2D8)",
        "header-gradient-end": "var(--header-gradient-end, #EBED8C)",
        // Figma palette — using rgb(var/<alpha-value>) to enable opacity utilities
        black: "rgb(var(--bg-black) / <alpha-value>)",
        "black-secondary": "rgb(var(--bg-black-secondary) / <alpha-value>)",
        "grey-light": "rgb(var(--bg-grey-light) / <alpha-value>)",
        "grey-lighter": "rgb(var(--bg-grey-lighter) / <alpha-value>)",
        grey: "rgb(var(--bg-grey) / <alpha-value>)",
        "grey-strong": "rgb(var(--bg-grey-strong) / <alpha-value>)",
        "grey-stronger": "rgb(var(--bg-grey-stronger) / <alpha-value>)",
        "grey-strongest": "rgb(var(--bg-grey-strongest) / <alpha-value>)",
        white: "rgb(var(--bg-white) / <alpha-value>)",
        "overlay-20": "rgba(41, 40, 40, 0.2)",
        "blue-primary": "rgb(var(--text-blue-primary) / <alpha-value>)",
        blue: "rgb(var(--text-blue) / <alpha-value>)",
        "green-primary": "rgb(var(--text-green-primary) / <alpha-value>)",
        green: "rgb(var(--text-green) / <alpha-value>)",
        "pastel-yellow": "rgb(var(--text-pastel-yellow) / <alpha-value>)",
        "pastel-yellow-secondary": "rgb(var(--text-pastel-yellow-secondary) / <alpha-value>)",
        yellow: "rgb(var(--text-yellow) / <alpha-value>)",
        khaki: "rgb(var(--text-khaki) / <alpha-value>)",
        orange: "rgb(var(--text-orange) / <alpha-value>)",
        "red-strong": "rgb(var(--text-red-strong) / <alpha-value>)",
        pink: "rgb(var(--text-pink) / <alpha-value>)",
        purple: "rgb(var(--text-purple) / <alpha-value>)",
        braun: "rgb(var(--text-braun) / <alpha-value>)",
        // Semantic tokens
        token: {
          canvas: "var(--token-canvas)",
          codeview: "var(--token-codeview)",
          state: {
            ignored: "var(--status-ignored-color)",
            selected: "var(--status-selected-color)",
            reshoot: "var(--status-reshoot-color)",
            "for-approval": "var(--status-for-approval-color)",
            refused: "var(--status-refused-color)",
            validated: "var(--status-validated-color)",
            "to-publish": "var(--status-to-publish-color)",
            published: "var(--status-published-color)",
            error: "var(--status-error-color)",
            "not-selected": "var(--status-not-selected-color)",
          },
          grade: {
            A: "var(--token-grade-A)",
            B: "var(--token-grade-B)",
            C: "var(--token-grade-C)",
            D: "var(--token-grade-D)",
            E: "var(--token-grade-E)",
          },
          flag: {
            yellow: "var(--token-flag-yellow)",
            orange: "var(--token-flag-orange)",
            red: "var(--token-flag-red)",
            pink: "var(--token-flag-pink)",
            purple: "var(--token-flag-purple)",
            blue: "var(--token-flag-blue)",
            green: "var(--token-flag-green)",
          },
          star: "var(--token-star)",
          urgent: "var(--token-urgent)",
          active: "var(--token-active)",
          alert: "var(--token-alert)",
          header: {
            "color-background": "var(--token-header-color-background)",
          },
          button: {
            "color-header-bg-primary": "var(--token-button-color-header-bg-primary)",
            "color-header-bg-secondary": "var(--token-button-color-header-bg-secondary)",
            "color-step-bg-active": "var(--token-button-color-step-bg-active)",
            "color-step-fg-active": "var(--token-button-color-step-fg-active)",
            "color-step-bg-inactive": "var(--token-button-color-step-bg-inactive)",
            "color-step-fg-inactive": "var(--token-button-color-step-fg-inactive)",
          },
        },
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
        full: "9999px",
      },
      fontSize: {
        xs: "var(--font-size-xs)", // 9px
        sm: "var(--font-size-sm)", // 11px
        base: "var(--font-size-base)", // 13px
        lg: "var(--font-size-lg)", // 16px
        xl: "var(--font-size-xl)", // 18px
        xxl: "var(--font-size-xxl)", // 20px
        "header-title": "var(--header-fs-title)",
        "button-header": "var(--button-fs-header)",
      },
      fontWeight: {
        light: "var(--font-weight-light)",
        regular: "var(--font-weight-regular)",
        normal: "var(--font-weight-regular)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-bold)",
        bold: "var(--font-weight-bold)",
        heavy: "var(--font-weight-heavy)",
      },
      lineHeight: {
        tight: "var(--font-lh-tight)",
        "125": "var(--font-lh125)",
        normal: "var(--font-lh-normal)",
        relaxed: "var(--font-lh-relaxed)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-slide": {
          "0%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
          "100%": { "background-position": "0% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-flow": "gradient-slide 3s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
