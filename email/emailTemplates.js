module.exports = {

  confirm: id => ({
    subject: 'URL Shortner Confirmation Email',
    html: `
    <h2 align="center">Welcome to URL Shortner</h2>
      <a href='https://ur1-sh.herokuapp.com/confirm/${id}'>
        Click here to verify your account
      </a>
    `,
    text: `Copy and paste this link: ${PORT}/confirm/${id}`
  }),

  verified: id => ({
    subject: 'Your account has been verified!',
    html: `
    <h2 align="center">Welcome to URL Shortner</h2>
      <a href="http://ur1-sh.herokuapp.com" align="center">Visit URL Shortner</a>
    `,
    text: `Copy and paste this link: ${PORT}/confirm/${id}`
  })

};
