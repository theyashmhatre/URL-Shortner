const PORT = process.env.PORT || 3000;

module.exports = {

  confirm: id => ({
    subject: 'Confirmation Email',
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
    <h2 align="center">Welcome to URL Shortner</h2>
      <a href="http://ur1-sh.herokuapp.com" style="text-align:center">Visit URL Shortner</a>
    `,
    text: `Copy and paste this link: ${PORT}`
  }),

  deleted: () => ({
    subject: 'Your account has been successfully deleted!',
    html: `
    <h1 align="center">We'll miss you!</h1>
    <p>Account successfully deleted</p><br>
    <p>Regards,<br>URL Shortner Team</p>
      <a href="http://ur1-sh.herokuapp.com" align="left">URL Shortner</a>
    `,
    text: `Copy and paste this link: ${PORT}`
  })

};
