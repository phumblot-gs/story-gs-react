
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{ts,tsx,js,jsx}",
		"./.storybook/**/*.{ts,tsx,js,jsx}"
	],
	prefix: "",
	safelist: [
		// Padding utilities pour s'assurer qu'elles sont générées même si non détectées
		'pl-1', 'pl-2', 'pl-3', 'pl-4', 'pl-5', 'pl-6', 'pl-8',
		'pr-1', 'pr-2', 'pr-3', 'pr-4', 'pr-5', 'pr-6', 'pr-8',
		'pt-1', 'pt-2', 'pt-3', 'pt-4', 'pt-5', 'pt-6', 'pt-8',
		'pb-1', 'pb-2', 'pb-3', 'pb-4', 'pb-5', 'pb-6', 'pb-8',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			// Spacing personnalisé basé sur la charte (5px increments)
			// Ces valeurs écrasent les valeurs par défaut de Tailwind tout en gardant les autres (px, 0.5, 1.5, etc.)
			spacing: {
				'0': '0rem',
				'1': '0.3125rem',     // 5px (écrase Tailwind 4px)
				'2': '0.625rem',      // 10px (écrase Tailwind 8px)
				'3': '0.9375rem',     // 15px (écrase Tailwind 12px)
				'4': '1.25rem',       // 20px (écrase Tailwind 16px)
				'5': '1.5625rem',     // 25px (écrase Tailwind 20px)
				'6': '1.875rem',      // 30px (écrase Tailwind 24px)
				'8': '2.5rem',        // 40px (écrase Tailwind 32px)
				'10': '3.125rem',     // 50px (écrase Tailwind 40px)
				'12': '3.75rem',      // 60px (écrase Tailwind 48px)
				'16': '5rem',         // 80px (écrase Tailwind 64px)
				'20': '6.25rem',      // 100px (écrase Tailwind 80px)
				'24': '7.5rem',       // 120px (écrase Tailwind 96px)
				'28': '8.75rem',      // 140px (nouveau)
				'30': '9.375rem',     // 150px (nouveau)
				'32': '10rem',        // 160px (écrase Tailwind 128px)
				'36': '11.25rem',     // 180px (écrase Tailwind 144px)
				'40': '12.5rem',      // 200px (écrase Tailwind 160px)
				'44': '13.75rem',     // 220px (nouveau)
				'48': '15rem',        // 240px (écrase Tailwind 192px)
				'50': '15.625rem',    // 250px (nouveau)
				'52': '16.25rem',     // 260px (écrase Tailwind 208px)
				'56': '17.5rem',      // 280px (écrase Tailwind 224px)
				'60': '18.75rem',     // 300px (écrase Tailwind 240px)
				'64': '20rem',        // 320px (écrase Tailwind 256px)
				'68': '21.25rem',     // 340px (nouveau)
				'70': '21.875rem',    // 350px (nouveau)
				'72': '22.5rem',      // 360px (écrase Tailwind 288px)
				'80': '25rem',        // 400px (écrase Tailwind 320px)
				'90': '28.125rem',    // 450px (nouveau)
				'100': '31.25rem',    // 500px (nouveau)
				// Valeurs sémantiques spécifiques
				'header': {
					'height': 'var(--header-height)',
					'pd-main-h': 'var(--header-pd-main-h)',
					'pd-main-v': 'var(--header-pd-main-v)',
					'pd-bloc-h': 'var(--header-pd-bloc-h)'
				},
				'button': {
					'header-size': 'var(--button-header-size)',
					'pd-header': 'var(--button-pd-header)',
					'radius-header': 'var(--button-radius-header)'
				},
				'padding': {
					'small': 'var(--padding-small)',
					'medium': 'var(--padding-medium)',
					'large': 'var(--padding-large)',
					'xlarge': 'var(--padding-xlarge)',
					'xxlarge': 'var(--padding-xxlarge)',
					'xxxlarge': 'var(--padding-xxxlarge)'
				}
			},
			// Ajout des polices personnalisées
			fontFamily: {
				'sans': ['var(--gs-font-sans, AvenirNextLTPro)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				'custom': ['AvenirNextLTPro', 'sans-serif'],
				'avenir': ['AvenirNextLTPro', 'sans-serif'],
				'mono': ['var(--gs-font-mono)', 'ui-monospace', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				'header-gradient-start': 'var(--header-gradient-start, #74D2D8)',
				'header-gradient-end': 'var(--header-gradient-end, #EBED8C)',
				// Figma custom colors - using rgb() for opacity support
				'black': 'rgb(var(--bg-black) / <alpha-value>)',
				'black-secondary': 'rgb(var(--bg-black-secondary) / <alpha-value>)',
				'grey-light': 'rgb(var(--bg-grey-light) / <alpha-value>)',
				'grey-lighter': 'rgb(var(--bg-grey-lighter) / <alpha-value>)',
				'grey': 'rgb(var(--bg-grey) / <alpha-value>)',
				'grey-strong': 'rgb(var(--bg-grey-strong) / <alpha-value>)',
				'grey-stronger': 'rgb(var(--bg-grey-stronger) / <alpha-value>)',
				'grey-strongest': 'rgb(var(--bg-grey-strongest) / <alpha-value>)',
				'white': 'rgb(var(--bg-white) / <alpha-value>)',
				'overlay-20': 'rgba(41, 40, 40, 0.2)',
				'blue-primary': 'rgb(var(--text-blue-primary) / <alpha-value>)',
				'blue': 'rgb(var(--text-blue) / <alpha-value>)',
				'green-primary': 'rgb(var(--text-green-primary) / <alpha-value>)',
				'green': 'rgb(var(--text-green) / <alpha-value>)',
				'pastel-yellow': 'rgb(var(--text-pastel-yellow) / <alpha-value>)',
				'pastel-yellow-secondary': 'rgb(var(--text-pastel-yellow-secondary) / <alpha-value>)',
				'yellow': 'rgb(var(--text-yellow) / <alpha-value>)',
				'khaki': 'rgb(var(--text-khaki) / <alpha-value>)',
				'orange': 'rgb(var(--text-orange) / <alpha-value>)',
				'red-strong': 'rgb(var(--text-red-strong) / <alpha-value>)',
				'pink': 'rgb(var(--text-pink) / <alpha-value>)',
				'purple': 'rgb(var(--text-purple) / <alpha-value>)',
				'braun': 'rgb(var(--text-braun) / <alpha-value>)',
				
				// Token semantic colors
				'token': {
					'canvas': 'var(--token-canvas)',
					'codeview': 'var(--token-codeview)',
					// States - updated to use the new status-based variable names
					'state': {
						'ignored': 'var(--status-ignored-color)',
						'selected': 'var(--status-selected-color)',
						'reshoot': 'var(--status-reshoot-color)',
						'for-approval': 'var(--status-for-approval-color)',
						'refused': 'var(--status-refused-color)',
						'validated': 'var(--status-validated-color)',
						'to-publish': 'var(--status-to-publish-color)',
						'published': 'var(--status-published-color)',
						'error': 'var(--status-error-color)',
						'not-selected': 'var(--status-not-selected-color)'
					},
					// Grades
					'grade': {
						'A': 'var(--token-grade-A)',
						'B': 'var(--token-grade-B)',
						'C': 'var(--token-grade-C)',
						'D': 'var(--token-grade-D)',
						'E': 'var(--token-grade-E)'
					},
					// Flags
					'flag': {
						'yellow': 'var(--token-flag-yellow)',
						'orange': 'var(--token-flag-orange)',
						'red': 'var(--token-flag-red)',
						'pink': 'var(--token-flag-pink)',
						'purple': 'var(--token-flag-purple)',
						'blue': 'var(--token-flag-blue)',
						'green': 'var(--token-flag-green)'
					},
					// Other
					'star': 'var(--token-star)',
					'urgent': 'var(--token-urgent)',
					'active': 'var(--token-active)',
					'alert': 'var(--token-alert)',
					// Header
					'header': {
						'color-background': 'var(--token-header-color-background)'
					},
					// Buttons
					'button': {
						'color-header-bg-primary': 'var(--token-button-color-header-bg-primary)',
						'color-header-bg-secondary': 'var(--token-button-color-header-bg-secondary)',
						'color-step-bg-active': 'var(--token-button-color-step-bg-active)',
						'color-step-fg-active': 'var(--token-button-color-step-fg-active)',
						'color-step-bg-inactive': 'var(--token-button-color-step-bg-inactive)',
						'color-step-fg-inactive': 'var(--token-button-color-step-fg-inactive)'
					}
				}
			},
			borderRadius: {
				'none': '0px',           // radiusNone
				'sm': '2px',             // radiusSm
				'DEFAULT': '4px',        // radiusBase
				'md': '6px',             // radiusMd
				'lg': '8px',             // radiusLg
				'xl': '12px',            // radiusXl
				'2xl': '16px',           // radius2xl
				'3xl': '24px',           // radius3xl
				'full': '9999px'         // radiusFull
			},
			fontSize: {
				'xs': 'var(--font-size-xs)',      // 9px (0.5625rem)
				'sm': 'var(--font-size-sm)',      // 11px (0.6875rem)
				'base': 'var(--font-size-base)',  // 13px (0.8125rem)
				'lg': 'var(--font-size-lg)',      // 16px (1rem)
				'xl': 'var(--font-size-xl)',      // 18px (1.125rem)
				'xxl': 'var(--font-size-xxl)',    // 20px (1.25rem)
				'header-title': 'var(--header-fs-title)',
				'button-header': 'var(--button-fs-header)'
			},
			fontWeight: {
				'light': 'var(--font-weight-light)',      // 300
				'regular': 'var(--font-weight-regular)',  // 400 (alias de normal)
				'normal': 'var(--font-weight-regular)',   // 400
				'medium': 'var(--font-weight-medium)',    // 500
				'semibold': 'var(--font-weight-bold)',    // 700 (pas de 600 dans nos fonts)
				'bold': 'var(--font-weight-bold)',        // 700
				'heavy': 'var(--font-weight-heavy)',      // 900
			},
			lineHeight: {
				'tight': 'var(--font-lh-tight)',      // 1
				'125': 'var(--font-lh125)',           // 1.25
				'normal': 'var(--font-lh-normal)',    // 1.5
				'relaxed': 'var(--font-lh-relaxed)',  // 1.75
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'gradient-slide': {
					'0%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' },
					'100%': { 'background-position': '0% 50%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gradient-flow': 'gradient-slide 3s ease infinite'  // Animation ralentie
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
