import nodemailer from "nodemailer";

const sendEmail = async (email, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp-pulse.com", // Your SMTP provider
            port: 587,
            secure: false, // Use false for TLS (port 587)
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        let result = await transporter.sendMail({
            from: `More_Matrimony <more@morematrimony.com>`,
            to: email,
            subject: subject, // Subject is now required
            html: htmlContent
        });

        console.log("✅ Email sent:", result.messageId);
        return result; // Return for debugging

    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Email sending failed.");
    }
};

export { sendEmail };
