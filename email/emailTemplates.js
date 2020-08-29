const PORT = process.env.PORT || 3000;

module.exports = {

  confirm: id => ({
    subject: 'URL Shortner Confirmation Email',
    html: `
    <h1 align="center">Welcome to URL Shortner</h1>
      <a href='https://ur1-sh.herokuapp.com/confirm/${id}'>
        Click here to verify your account
      </a>
    `,
    text: `Copy and paste this link: ${PORT}/confirm/${id}`
  }),

  verified: () => ({
    subject: 'Your account has been verified!',
    html: `
    <h1 align="center">Welcome to URL Shortner</h1>
      <a href="http://ur1-sh.herokuapp.com" align="center">Visit URL Shortner</a>
    `,
    text: `Copy and paste this link: ${PORT}`
  })

};
