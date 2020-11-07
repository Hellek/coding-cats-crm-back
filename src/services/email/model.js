import nodemailer from 'nodemailer'

class Email {
	constructor() {
		// Валидация обязательных полей при загрузке сервиса
		if (global.ENV.HAS_EMAIL_SERVICE) {
			if (!Object.keys(global.ENV.SMTP_USERS).length) throw 'Требуется минимум 1 global.ENV.SMTP_USERS'
			if (!Object.keys(global.ENV.SMTP_HOSTS).length) throw 'Требуется минимум 1 global.ENV.SMTP_HOSTS'
		}

		this.isProd = global.ENV.ENV === 'production'
	}

	/**
	* @summary Отправка email через SMTP
	* @param {string} from - адрес отправителя '"Roman Kitts" <email@example.com>'
	* @param {string} to - список получателей 'reciever1@example.com, reciever2@example.com'
	* @param {string} subject - тема письма
	* @param {string} html - html-содержимое письма
	*/
	async send({
		from = `"${global.ENV.SMTP_USERS.bot.name}" <${global.ENV.SMTP_USERS.bot.user}>`,
		to,
		subject,
		html,
	}) {
		if (!global.ENV.HAS_EMAIL_SERVICE) throw Error('Отправка email невозможна. HAS_EMAIL_SERVICE is false')

		const transport = await this._getTransport()

		// send mail with defined transport object
		const info = await transport.sendMail({
			from,
			to,
			subject,
			html,
		})

		console.log('Message sent: %s', info.messageId)

		if (!this.isProd) {
			// Preview only available when sending through an Ethereal account
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
		}
	}

	async _getTransport({ smtpUserName = 'bot' } = {}) {
		let { auth } = global.ENV.SMTP_USERS[smtpUserName]

		if (!this.isProd) {
			// https://nodemailer.com/about/#example
			const testAccount = await nodemailer.createTestAccount()

			auth = {
				user: testAccount.user,
				pass: testAccount.pass,
			}
		}

		return nodemailer.createTransport({
			...global.ENV.SMTP_HOSTS[this.isProd ? 'yandex' : 'ethereal'],
			auth,
		})
	}
}

export default Email
