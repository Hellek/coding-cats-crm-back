import run from '@rollup/plugin-run'
import babel from 'rollup-plugin-babel'

const dev = process.env.NODE_ENV === 'development'

export default {
	input: 'src/index.js',
	output: {
		file: 'dist/index.js',
		format: 'cjs',
	},
	external: [
		'http',
		'dotenv',
		'koa',
		'koa-router',
		'koa-helmet',
		'koa-bodyparser',
		'@koa/cors',
	],
	plugins: [
		babel({
			babelrc: false,
			plugins: ['@babel/plugin-proposal-optional-chaining'],
		}),
		dev && run({
			execArgv: ['-r', 'dotenv/config'],
		}),
	],
}
