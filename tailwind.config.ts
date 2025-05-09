
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
		// Redefine base spacing using 5px multiples
		spacing: {
			'0': '0px',
			'px': '1px',
			'0.5': '2.5px',
			'1': '5px',
			'1.5': '7.5px',
			'2': '10px',
			'2.5': '12.5px',
			'3': '15px',
			'3.5': '17.5px',
			'4': '20px',
			'5': '25px',
			'6': '30px',
			'7': '35px',
			'8': '40px',
			'9': '45px',
			'10': '50px',
			'11': '55px',
			'12': '60px',
			'14': '70px',
			'16': '80px',
			'20': '100px',
			'24': '120px',
			'28': '140px',
			'32': '160px',
			'36': '180px',
			'40': '200px',
			'44': '220px',
			'48': '240px',
			'52': '260px',
			'56': '280px',
			'60': '300px',
			'64': '320px',
			'72': '360px',
			'80': '400px',
			'96': '480px',
		},
		extend: {
			// Ajout des polices personnalisées
			fontFamily: {
				'custom': ['AvenirNextLTPro', 'sans-serif'],
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
				// Figma custom colors - updated to use CSS variables with fallbacks
				'black': 'var(--bg-black, #292828)',
				'black-secondary': 'var(--bg-black-secondary, #3A3A3A)',
				'grey-light': 'var(--bg-grey-light, #EFEFEFEF)',
				'grey-lighter': 'var(--bg-grey-lighter, #F3F3F3)',
				'grey': 'var(--bg-grey, #EAEAEA)',
				'grey-strong': 'var(--bg-grey-strong, #D9D7D7)',
				'grey-stronger': 'var(--bg-grey-stronger, #C1C1C1)',
				'grey-strongest': 'var(--bg-grey-strongest, #595959)',
				'white': 'var(--bg-white, #FFFFFF)',
				'blue-primary': 'var(--text-blue-primary, #CDEDFF)',
				'blue': 'var(--text-blue, #74D4DA)',
				'green-primary': 'var(--text-green-primary, #9EDEDAB)',
				'green': 'var(--text-green, #89CC52)',
				'pastel-yellow': 'var(--text-pastel-yellow, #EBED8C)',
				'pastel-yellow-secondary': 'var(--text-pastel-yellow-secondary, #FFF8D0)',
				'yellow': 'var(--text-yellow, #FFD331)',
				'khaki': 'var(--text-khaki, #B7BB28)',
				'orange': 'var(--text-orange, #FF9900)',
				'red-strong': 'var(--text-red-strong, #DD3733)',
				'pink': 'var(--text-pink, #AAAD4D)',
				'purple': 'var(--text-purple, #A44C9F)',
				'braun': 'var(--text-braun, #B88029)',
				
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
			// Custom spacing that overrides the base spacing are preserved in extend
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
				'gradient-flow': 'gradient-slide 1s ease infinite'  // Changé de 3s à 1s
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
