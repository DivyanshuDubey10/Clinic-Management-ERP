const nodemailer = require('nodemailer');

const testSMTP = async () => {
    try {
        console.log('Attempting hardcoded SMTP test...');
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            auth: {
                user: 'divyadubey2206@gmail.com',
                pass: 'YOUR_PASSWORD_HERE',
            },
        });

        const info = await transporter.sendMail({
            from: '"Clinic ERP" <divyadubey2206@gmail.com>',
            to: 'divyadubey2206@gmail.com',
            subject: 'Clinic ERP - Hardcoded SMTP Test',
            text: 'Hello! This is a test email.'
        });
        console.log('✅ Test email sent successfully! Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Failed to send email. Error details:');
        console.error(error);
    }
};

testSMTP();
