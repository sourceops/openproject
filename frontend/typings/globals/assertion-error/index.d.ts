// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/86bb15f6b9a3515bd9b3ca61f2a670533ac6b908/assertion-error/assertion-error.d.ts
declare module 'assertion-error' {
	class AssertionError implements Error {
		constructor(message: string, props?: any, ssf?: Function);
		name: string;
		message: string;
		showDiff: boolean;
		stack: string;
	}
	export = AssertionError;
}