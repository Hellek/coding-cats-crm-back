import defaultConfig from './rollup.config.js'

export default {
	...defaultConfig,
	input: 'src/core/migrations.js',
	output: {
		file: 'dist/migrations.js',
		format: 'cjs',
	},
	external: [
		'postgres-migrations',
		'dotenv',
		'pg',
	],
}
