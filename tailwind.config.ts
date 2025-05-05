import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
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
				// Figma custom colors
				'black': '#292828',
				'black-secondary': '#3A3A3A',
				'grey-light': '#EFEFEFEF',
				'grey-lighter': '#F3F3F3',
				'grey': '#EAEAEA',
				'grey-strong': '#D9D7D7',
				'grey-stronger': '#C1C1C1',
				'grey-strongest': '#595959',
				'white': '#FFFFFF',
				'blue-primary': '#CDEDFF',
				'blue': '#74D4DA',
				'green-primary': '#9EDEDAB',
				'green': '#89CC52',
				'pastel-yellow': '#EBED8C',
				'pastel-yellow-secondary': '#FFF8D0',
				'yellow': '#FFD331',
				'khaki': '#B7BB28',
				'orange': '#FF9900',
				'red-strong': '#DD3733',
				'pink': '#AAAD4D',
				'purple': '#A44C9F',
				'braun': '#B88029',
				
				// Token semantic colors
				'token': {
					'canvas': 'var(--token-canvas)',
					'codeview': 'var(--token-codeview)',
					// States
					'state': {
						'ignored': 'var(--token-state-ignored)',
						'selected': 'var(--token-state-selected)',
						'reshoot': 'var(--token-state-reshoot)',
						'for-approval': 'var(--token-state-for-approval)',
						'refused': 'var(--token-state-refused)',
						'validated': 'var(--token-state-validated)',
						'to-publish': 'var(--token-state-to-publish)',
						'published': 'var(--token-state-published)',
						'error': 'var(--token-state-error)'
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
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontSize: {
				'xs': 'var(--font-size-xs)',
				'sm': 'var(--font-size-sm)',
				'base': 'var(--font-size-base)',
				'lg': 'var(--font-size-lg)',
				'xl': 'var(--font-size-xl)',
				'header-title': 'var(--header-fs-title)',
				'button-header': 'var(--button-fs-header)'
			},
			spacing: {
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
