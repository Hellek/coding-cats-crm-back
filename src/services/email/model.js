import nodemailer from 'nodemailer'

class Email {
	constructor() {
		this.SMTP_USERS = JSON.parse(process.env.SMTP_USERS)
		this.SMTP_HOSTS = JSON.parse(process.env.SMTP_HOSTS)

		// Валидация обязательных полей при загрузке сервиса
		if (process.env.HAS_EMAIL_SERVICE === 'true') {
			if (typeof this.SMTP_USERS !== 'object' || !this.SMTP_USERS.bot) throw 'Требуется как минимум 1 стандартный пользователь "process.env.SMTP_USERS.bot"'
			if (typeof this.SMTP_HOSTS !== 'object' || !Object.keys(this.SMTP_HOSTS).length) throw 'Требуется минимум 1 хост process.env.SMTP_HOSTS'
		}

		this.isProd = process.env.ENV === 'production'
	}

	/**
	* @summary Отправка email через SMTP
	* @param {string} from - адрес отправителя '"Roman Kitts" <email@example.com>'
	* @param {string} to - список получателей 'reciever1@example.com, reciever2@example.com'
	* @param {string} subject - тема письма
	* @param {string} html - html-содержимое письма
	*/
	async send({
		from = `"${this.SMTP_USERS.bot.name}" <${this.SMTP_USERS.bot.user}>`,
		to,
		subject,
		html,
	}) {
		if (process.env.HAS_EMAIL_SERVICE !== 'true') throw Error('Отправка email невозможна. HAS_EMAIL_SERVICE is false')

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
		let auth = this.SMTP_USERS[smtpUserName]

		if (!this.isProd) {
			// https://nodemailer.com/about/#example
			const testAccount = await nodemailer.createTestAccount()

			auth = {
				user: testAccount.user,
				pass: testAccount.pass,
			}
		}

		return nodemailer.createTransport({
			...this.SMTP_HOSTS[this.isProd ? 'yandex' : 'ethereal'],
			auth,
		})
	}
}

export default Email
