import emailjs from 'emailjs-com'

const sendEmail = (to, name, lastName, email, subject) => {
  const templateParams = {
    to_email: to,
    subject,
    name,
    email,
    lastName
  }

  return emailjs.send(
    'service_jz3v30b',
    'template_2db1odf',
    templateParams,
    'C_Smqye9-LkqWdy_N'
  )
}

export default sendEmail
