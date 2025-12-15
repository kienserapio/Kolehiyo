// Allow importing image assets in TypeScript
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';

// If you need typed imports (e.g. React components for SVGs), add more specific declarations.

// Minimal declaration for the `qrcode` package used to generate data URLs
declare module 'qrcode' {
	export function toDataURL(text: string, cb: (err: Error | null, url: string) => void): void;
	const _default: {
		toDataURL: (text: string, cb: (err: Error | null, url: string) => void) => void;
	};
	export default _default;
}
