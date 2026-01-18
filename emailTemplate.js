/**
 * Email template for job applications
 * @param {string} recipientName - Optional recipient name
 * @returns {string} HTML formatted email body
 */
export function getEmailTemplate(recipientName = 'Sir/Madam') {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .signature {
            margin-top: 30px;
        }
        .contact-info {
            margin-top: 10px;
            font-size: 0.9em;
            color: #555;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="header">
        <p>Greetings ${recipientName},</p>
    </div>
    
    <div class="content">
        <p>My name is Nandini, and I am a final year Computer Science and Engineering student at JIIT, Noida, with a GPA of 9.2/10. I am passionate about full-stack engineering and have hands-on experience with Next.js, React.js, Node.js, Ruby, Kubernetes, and databases such as MongoDB, MySQL, PostgreSQL, and Redis. I am currently seeking full time opportunities for the 2026 batch.</p>
        
        <p>Here is a brief overview of my background and experience:</p>
        
        <ul>
            <li><strong>SDE Intern, Procol (Current):</strong> Working with the Quality team on enhancements and bug fixing.</li>
            
            <li><strong>SDE Intern, Probo:</strong> Contributed to both frontend and backend development of geolocation-based features for the primary application.</li>
            
            <li><strong>Full Stack Developer Intern, Superreply.ai:</strong> Built responsive Next.js interfaces, integrated payment workflows, and optimized backend performance, resulting in a 20% improvement in workflow efficiency.</li>
            
            <li><strong>Full Stack Developer Intern, CausalFunnel:</strong> Automated real-time analytics dashboards, and enhanced customer reporting through interactive visualizations.</li>
            
            <li><strong>Technical Head, Knuth Programming Hub:</strong> Mentored 200+ students in Data Structures & Algorithms and project development.</li>
            
            <li><strong>Competitive Programming:</strong> Ranked 5th Globally in ICPC AlgoQueen'25. Solved 800+ problems on LeetCode (Max Rating: 1739), 3 Star on CodeChef (1756), and Pupil on Codeforces (1285).</li>
        </ul>
        
        <p>I believe my technical expertise, problem-solving ability, and collaborative mindset make me a strong fit for impactful engineering roles. I am eager to contribute to challenging projects while continuing to grow professionally.</p>
        
        <p>Please find my resume below for your review.</p>
        
        <p><strong>Resume:</strong> <a href="https://drive.google.com/file/d/1-6o7IQzJHY56fzAVNldLTWjLpT8ku_G6/view">https://drive.google.com/file/d/1-6o7IQzJHY56fzAVNldLTWjLpT8ku_G6/view</a></p>
        
        <p>Thank you for considering my application.</p>
    </div>
    
    <div class="signature">
        <p>Best regards,<br>Nandini</p>
        
        <div class="contact-info">
            <p>
                Email: <a href="mailto:nandinijindal010@gmail.com">nandinijindal010@gmail.com</a> | 
                Phone: +91-8054821129<br>
                Portfolio: <a href="https://nandini80.github.io/Nandini.github.io/">https://nandini80.github.io/Nandini.github.io/</a><br>
                GitHub: <a href="https://github.com/Nandini80">https://github.com/Nandini80</a> | 
                LinkedIn: <a href="https://www.linkedin.com/in/nandini-jindal-33a3a7282">https://www.linkedin.com/in/nandini-jindal-33a3a7282</a>
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

/**
 * Plain text version of the email template
 */
export function getEmailTemplateText(recipientName = 'Sir/Madam') {
  return `
Greetings ${recipientName},

My name is Nandini, and I am a final year Computer Science and Engineering student at JIIT, Noida, with a GPA of 9.2/10. I am passionate about full-stack engineering and have hands-on experience with Next.js, React.js, Node.js, Ruby, Kubernetes, and databases such as MongoDB, MySQL, PostgreSQL, and Redis. I am currently seeking full time opportunities for the 2026 batch.

Here is a brief overview of my background and experience:

- SDE Intern, Procol (Current): Working with the Quality team on enhancements and bug fixing.

- SDE Intern, Probo: Contributed to both frontend and backend development of geolocation-based features for the primary application.

- Full Stack Developer Intern, Superreply.ai: Built responsive Next.js interfaces, integrated payment workflows, and optimized backend performance, resulting in a 20% improvement in workflow efficiency.

- Full Stack Developer Intern, CausalFunnel: Automated real-time analytics dashboards, and enhanced customer reporting through interactive visualizations.

- Technical Head, Knuth Programming Hub: Mentored 200+ students in Data Structures & Algorithms and project development.

- Competitive Programming: Ranked 5th Globally in ICPC AlgoQueen'25. Solved 800+ problems on LeetCode (Max Rating: 1739), 3 Star on CodeChef (1756), and Pupil on Codeforces (1285).

I believe my technical expertise, problem-solving ability, and collaborative mindset make me a strong fit for impactful engineering roles. I am eager to contribute to challenging projects while continuing to grow professionally.

Please find my resume below for your review.

Resume: https://drive.google.com/file/d/1-6o7IQzJHY56fzAVNldLTWjLpT8ku_G6/view

Thank you for considering my application.

Best regards,
Nandini

Email: nandinijindal010@gmail.com | Phone: +91-8054821129
Portfolio: https://nandini80.github.io/Nandini.github.io/
GitHub: https://github.com/Nandini80 | LinkedIn: https://www.linkedin.com/in/nandini-jindal-33a3a7282
  `.trim();
}

