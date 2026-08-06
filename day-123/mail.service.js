import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID
    }
})
//with nodemailer, we need to create a transporter as well, using which we send the email
// jo hamari mail wali service hai, jo hamari mail handle karti hai, wo sare mail SMTP server ke through hi send karti hai. it cant be done by our webserver. transporter helps in communicating between our web and smtp server.


//The Web Server (Your Node.js app) is like the person writing a letter.
//The SMTP Server (like Gmail, SendGrid, or Mailtrap) is the Post Office.
//The Transporter is the delivery truck or the connection that carries your letter from your house to the post office.

// yaha hum google k smpt server use kar rahe hain, inn server se connect karne k liye auth property use hota hai. so the google id's we have in .env file is used here.



//transporter.verify() checks the email server and confirm that its ready to send emails.

transporter.verify()
    .then(() => { console.log("Email transporter is ready to send emails"); })
    .catch((err) => { console.error("Email transporter verification failed:", err); });


export async function sendEmail({ to, subject, html, text="" }) {

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    };

    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent:", details);
    return `email sent successfully to ${to}`;
}




