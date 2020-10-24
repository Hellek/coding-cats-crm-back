module.exports = {
	root: true,
	env: {
		node: true,
		es2020: true,
	},
	parserOptions: {
		parser: 'babel-eslint',
		sourceType: 'module',
	},
	extends: [
		'eslint:recommended',
	],
	rules: {
		'max-len': 'off',
		'linebreak-style': [
			'error',
			'unix',
		],
		'object-curly-newline': [
			'error',
			{
				ObjectPattern: {
					consistent: true,
				},
			},
		],
		'arrow-parens': [
			'error',
			'as-needed',
		],
		indent: [
			'error',
			'tab',
		],
		'no-tabs': [
			'error',
			{
				allowIndentationTabs: true,
			},
		],
		quotes: [
			'error',
			'single',
			{
				allowTemplateLiterals: true,
			},
		],
		semi: [
			'error',
			'never',
		],
		'no-plusplus': [
			'error',
			{
				allowForLoopAfterthoughts: true,
			},
		],
		'comma-spacing': [
			'error',
			{
				'before': false,
				'after': true,
			},
		],
		'comma-dangle': [
			'error',
			{
				arrays: 'always-multiline',
				objects: 'always-multiline',
				imports: 'always-multiline',
				exports: 'always-multiline',
				functions: 'ignore',
			},
		],
		'newline-per-chained-call': [
			'error',
			{
				ignoreChainWithDepth: 4,
			},
		],
		'no-multiple-empty-lines': [
			'warn',
			{
				max: 2,
			},
		],
		'eol-last': [
			'error',
			'always',
		],
	},
}
