const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Payment provider configuration
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@risetogether.org';
const EMAIL_TO = process.env.EMAIL_TO || 'info@risetogether.org';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Simple in-memory rate limiting
const rateLimits = new Map();
function checkRateLimit(key, windowMs = 60000, maxRequests = 10) {
    const now = Date.now();
    const record = rateLimits.get(key) || { count: 0, resetTime: now + windowMs };
    if (now > record.resetTime) {
        record.count = 0;
        record.resetTime = now + windowMs;
    }
    record.count++;
    rateLimits.set(key, record);
    return record.count <= maxRequests;
}

// Create email transporter if configured
let emailTransporter = null;
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    emailTransporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT),
        secure: parseInt(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });
}

async function sendEmailNotification(submission) {
    if (!emailTransporter) {
        console.log('Email not configured. Submission saved to file only.');
        return;
    }
    try {
        const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        await emailTransporter.sendMail({
            from: EMAIL_FROM,
            to: EMAIL_TO,
            subject: `New ${submission.type} Inquiry - ${submission.name}`,
            text: `New ${submission.type} inquiry received:\n\nName: ${submission.name}\nEmail: ${submission.email}\nPhone: ${submission.phone || 'N/A'}\nMessage: ${submission.message}\n\nReceived at: ${submission.createdAt}`,
            html: `<h2>New ${escapeHtml(submission.type)} inquiry</h2><p><strong>Name:</strong> ${escapeHtml(submission.name)}</p><p><strong>Email:</strong> ${escapeHtml(submission.email)}</p><p><strong>Phone:</strong> ${escapeHtml(submission.phone || 'N/A')}</p><p><strong>Message:</strong> ${escapeHtml(submission.message)}</p><p><strong>Received:</strong> ${escapeHtml(submission.createdAt)}</p>`
        });
    } catch (err) {
        console.error('Email notification failed:', err.message);
    }
}

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    if (!checkRateLimit(req.ip + ':stripe', 60000, 5)) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    if (!STRIPE_SECRET_KEY) {
        return res.status(503).json({ error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY.' });
    }

    try {
        const stripe = require('stripe')(STRIPE_SECRET_KEY);
        const { amount, name, email } = req.body;
        const amountNum = parseFloat(amount);
        const amountCents = Math.round(amountNum * 100);

        if (!amountNum || isNaN(amountNum) || amountCents < 100 || amountCents > 1000000) {
            return res.status(400).json({ error: 'Amount must be between $1.00 and $10,000.00' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Donation to Rise Together Initiative',
                        description: 'Supporting refugee and host communities in Uganda'
                    },
                    unit_amount: amountCents
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${BASE_URL}/?payment=success`,
            cancel_url: `${BASE_URL}/?payment=cancel`,
            customer_email: email || undefined
        });

        res.json({ url: session.url });
    } catch (err) {
        console.error('Stripe error:', err.message);
        res.status(500).json({ error: 'Payment session creation failed. Please try again.' });
    }
});

// Create Flutterwave Payment Link (for MTN/Airtel Mobile Money)
app.post('/api/create-flutterwave-payment', async (req, res) => {
    if (!checkRateLimit(req.ip + ':flutterwave', 60000, 5)) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    if (!FLW_SECRET_KEY) {
        return res.status(503).json({ error: 'Flutterwave is not configured. Please set FLW_SECRET_KEY.' });
    }

    try {
        const { amount, name, email, phone } = req.body;
        const amountNum = parseFloat(amount);

        if (!amountNum || isNaN(amountNum) || amountNum < 1 || amountNum > 10000) {
            return res.status(400).json({ error: 'Amount must be between $1.00 and $10,000.00' });
        }

        const payload = JSON.stringify({
            tx_ref: `RTI-${Date.now()}`,
            amount: amountNum,
            currency: 'USD',
            redirect_url: `${BASE_URL}/?payment=success`,
            meta: { consumer_id: Date.now(), consumer_mac: '92a3-912ba-1192a' },
            customer: {
                email: email || 'donor@example.com',
                phonenumber: phone || '',
                name: name || 'Anonymous Donor'
            },
            customizations: {
                title: 'Donation to Rise Together Initiative',
                description: 'Supporting refugee and host communities in Uganda',
                logo: `${BASE_URL}/RTI-logo2.png`
            },
            payment_options: 'card,mobilemoneyuganda'
        });

        const options = {
            hostname: 'api.flutterwave.com',
            path: '/v3/payments',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${FLW_SECRET_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const flutterwaveReq = https.request(options, (flutterwaveRes) => {
            let data = '';
            flutterwaveRes.on('data', (chunk) => {
                data += chunk;
            });
            flutterwaveRes.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    if (parsedData.status === 'success' && parsedData.data && parsedData.data.link) {
                        res.json({ url: parsedData.data.link });
                    } else {
                        console.error('Flutterwave error:', parsedData);
                        res.status(500).json({ error: 'Payment link creation failed. Please try again.' });
                    }
                } catch (err) {
                    console.error('Flutterwave JSON parse error:', err.message);
                    res.status(500).json({ error: 'Payment service response invalid. Please try again.' });
                }
            });
        });

        flutterwaveReq.on('error', (err) => {
            console.error('Flutterwave request error:', err.message);
            res.status(500).json({ error: 'Payment service unavailable. Please try again.' });
        });

        flutterwaveReq.write(payload);
        flutterwaveReq.end();
    } catch (err) {
        console.error('Flutterwave error:', err.message);
        res.status(500).json({ error: 'Payment service unavailable. Please try again.' });
    }
});

// Save contact form submission
app.post('/api/contact', async (req, res) => {
    if (!checkRateLimit(req.ip + ':contact', 60000, 5)) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    try {
        const { type, name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        // Simple sanitization
        const sanitize = (str) => str.replace(/[<>]/g, '').trim();
        const submission = {
            id: Date.now(),
            type: sanitize(type || 'general'),
            name: sanitize(name),
            email: sanitize(email),
            phone: sanitize(phone || ''),
            message: sanitize(message),
            createdAt: new Date().toISOString()
        };

        const filePath = path.join(__dirname, 'submissions.json');
        let submissions = [];
        if (fs.existsSync(filePath)) {
            submissions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        submissions.push(submission);
        fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));

        // Send email notification
        await sendEmailNotification(submission);

        res.json({ success: true, message: 'Submission received successfully' });
    } catch (err) {
        console.error('Contact form error:', err.message);
        res.status(500).json({ error: 'Failed to save submission. Please try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Payment providers:');
    console.log(`  - Stripe: ${STRIPE_SECRET_KEY ? 'configured' : 'NOT CONFIGURED'}`);
    console.log(`  - Flutterwave: ${FLW_SECRET_KEY ? 'configured' : 'NOT CONFIGURED'}`);
    console.log(`  - Email: ${emailTransporter ? 'configured' : 'NOT CONFIGURED'}`);
    console.log('Press Ctrl+C to stop');
});
