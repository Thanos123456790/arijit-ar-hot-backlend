import nodemailer from "nodemailer";
import moment from "moment-timezone";
import dotenv from "dotenv";

dotenv.config();


export const generateCalendarLink = (test) => {
    const start = moment(test.startDate).utc().format("YYYYMMDDTHHmmss[Z]");
    const end = moment(test.expiryDate).utc().format("YYYYMMDDTHHmmss[Z]");
    const text = encodeURIComponent("Test Invitation");
    const details = encodeURIComponent("You have been assigned a test.");
    const location = encodeURIComponent("Online");

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
};

export const generateEmailHTML = (test, calendarLink, messageText, showCalendar = true) => {
    return `
    <div style="font-family:Arial,sans-serif;padding:20px;background-color:#f4f4f4;">
      <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px;">
        <h2 style="color:#4CAF50;">📝 Test Notification</h2>
        <p>Dear Student,</p>
        <p>${messageText}</p>
        <ul>
          <li><strong>Test Name:</strong> ${test.name}</li>
          <li><strong>Start Date:</strong> ${moment(test.startDate).tz("Asia/Kolkata").format("DD MMM YYYY, hh:mm A")}</li>
          <li><strong>Expiry Date:</strong> ${moment(test.expiryDate).tz("Asia/Kolkata").format("DD MMM YYYY, hh:mm A")}</li>
        </ul>
        ${showCalendar ? `<a href="${calendarLink}" style="display:inline-block;padding:10px 20px;margin-top:15px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
          📅 Add to Google Calendar
        </a>` : ""}
        <p style="margin-top:30px;">Best of luck!<br/>Your Exam Team</p>
      </div>
    </div>
  `;
};

export const sendTestEmail = async ({ email, test, messageText, showCalendar = true }) => {
    const calendarLink = generateCalendarLink(test);
    const html = generateEmailHTML(test, calendarLink, messageText, showCalendar);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"ExamBot" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "📩 Test Notification",
        html,
    });
};
