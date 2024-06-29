module.exports = (name, email, password) => {
    return `
    <body>
    <div>Hi ${name}</div>
        <div>Here is your credentials to sign in</div>
        <div>Email : ${email}</div>
        <div>Password : ${password}</div>
    </body>
    `
}