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
		'cryptr',
		'dotenv',
		'jsonwebtoken',
		'koa',
		'koa-bodyparser',
		'koa-helmet',
		'koa-jwt',
		'koa-router',
		'@koa/cors',
		'pg',
		'isemail',
		'bcryptjs',
		'socket.io',
		'nodemailer',
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
