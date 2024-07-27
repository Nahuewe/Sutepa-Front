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
    'service_5yvvmdd',
    'template_ep0vv1q',
    templateParams,
    'u1HZcSHJOPhUccD57'
  )
}

export default sendEmail
