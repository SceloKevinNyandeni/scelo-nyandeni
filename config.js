/* ==== CONFIG ====
 - Anything left '' or marked placeholder:true shows as a [placeholder] in the UI.
 - links.cv: path or URL of your PDF (e.g. 'cv.pdf' next to this page). Leave '' until ready.
 - Add a project by copying an object in projects; its id works with `project <id>`.
 - shots: image sources for a project (use data: URIs on this hosted page). */
const CFG = {
    name: 'Scelo Nyandeni',
    title: 'Junior Software Developer',
    headline: 'Junior Software Developer | Web & Backend Engineering',
    intro: 'Junior software developer with hands-on experience in web development, backend systems and GIS automation. I work with Java, Spring Boot, JavaScript, PHP, SQL and PyQGIS, and I like turning messy real-world workflows into software people can rely on.',
    now: 'Software Development Intern, Corlink Networks',
    available: true,
    status: 'BUILDING SOMETHING USEFUL',
    about: {
        bio: ['Junior software developer with hands-on experience in web development, backend systems and data analysis.', 'Skilled in Java, JavaScript, PHP and SQL, with practical exposure to WordPress, Drupal, Spring Boot and RESTful APIs, plus a foundation in Agile development and database-driven applications. Customer-facing retail experience adds strong communication and teamwork.'],
        strengths: ['Verbal communication', 'Customer service and sales', 'Collaboration in technical and non-technical teams', 'Time management under pressure'],
        interests: '',
        philosophy: '',
        goals: ''
    },
    links: {
        github: 'https://github.com/SceloKevinNyandeni/',
        linkedin: 'https://www.linkedin.com/in/scelo-nyandeni/',
        email: 'scelokevinnyandeni22@gmail.com',
        cv: './cv/Scelo_Kevin_Nyandeni_CV.pdf'
    },
    projects: [{
            id: 'rapidcare',
            name: 'RapidCare Backend',
            status: 'In development',
            repo: '',
            demo: '',
            desc: 'RapidCare, a South African emergency medical response app. Users open emergency cases, dispatch staff (paramedics and operators) work them, and an in-app assistant powered by Google Gemini gives basic first-aid guidance while help is on the way.',
            stack: ['Java 21', 'Spring Boot 3.4', 'PostgreSQL', 'JWT', 'Maven', 'SwiftUI client', 'springdoc-openapi', 'JUnit 5', 'Mockito', 'AssertJ', 'H2'],
            features: ['Registration and login with JWT bearer tokens. Passwords are stored as BCrypt hashes', 'Emergency cases with location, incident type, severity and transit status', 'chat sessions whose messages are answered by Google Gemini, constrained by a system prompt to first aid, app help and non-diagnostic health information', 'Live ambulance location during a dispatch, for the patient tracking map', 'Shareable family tracking links that need no login and show nothing about the patient', 'operators assign an available ambulance to a case, and crews move it through DISPATCHED → EN_ROUTE → ARRIVED → COMPLETED', 'Request validation with structured 400 responses, and a consistent JSON error body with a correlation id for debugging', 'Schema managed by Flyway. Hibernate only validates it'],
            decisions: ['Planned but not built yet: hospitals and next-of-kin endpoints (#37), case notes, refresh tokens'],
            shots: []
        },
        {
            id: 'ngobe-exalt',
            name: 'Ngobe Exalt Backend',
            status: 'Client stopped development, so backend is not deployed',
            repo: 'https://github.com/MSTR-Software-Solutions/ngobe-exalt',
            demo: '',
            desc: 'E-commerce backend for Ngobe Exalt Group, covering procurement and on-site technical services, with Paystack payments.',
            stack: ['Java', 'Spring Boot', 'MySQL', 'Flyway', 'JWT', 'Paystack', 'Resend', 'Railway'],
            features: ['JWT auth filter with request rate limiting', 'Paystack transactions with unique references and amounts stored in kobo', 'Transactional email through Resend', 'Swagger docs gated behind an environment flag'],
            decisions: ['Flyway migrations with schema validation instead of auto-DDL', 'Resend API instead of SMTP, which is blocked on Railway', 'Checkstyle, SpotBugs and JaCoCo enforced in the Maven verify build'],
            shots: []
        },
        {
            id: 'ISTQB Foundation Level Practice Tests',
            name: 'ISTQB Foundation Level Practice Tests',
            status: 'In development',
            repo: 'https://github.com/SceloKevinNyandeni/ISTQB-Prac',
            demo: './media/demovideo.mp4',
            desc: 'Web application for practicing ISTQB Foundation certification exams, with question banks and performance analytics.',
            stack: ['JavaScript', 'React.js', 'CSS'],
            features: ['Central dashboard providing access to Real-Time Examination and Interactive Learning, with an overview of learning progress, including questions attempted, overall accuracy, completed examinations, recent results, and chapter-level performance.', 'Allows users to browse and select examination papers, view examination details (questions, marks, pass mark, duration, syllabus version, and document version), and launch an examination in either available mode.', 'Provides flexible learning sessions based on full examination papers, individual syllabus chapters, or previously incorrect answers. Supports resuming unfinished sessions.', 'Tracks and displays performance metrics, including the number of questions attempted, overall accuracy, completed examinations, recent results, and chapter-level performance.', 'Supports multiple question types, including multiple-choice questions (MCQs) with single or multiple correct answers, and provides immediate feedback on answers.', 'Includes a comprehensive question bank with detailed explanations for each question, allowing users to review and learn from their mistakes.', 'Provides a user-friendly interface for navigating through questions, marking questions for review, and submitting answers.', 'Implements a scoring system that calculates marks based on correct answers and provides a final score at the end of the examination.', 'Allows users to view their examination history and track their progress over time.', 'Reference materials and resources are provided to support learning and exam preparation.', 'Responsive design for optimal viewing on various devices, including desktops, tablets, and mobile phones.'],
            decisions: ['A Spring Boot backend is planned as the next step'],
            shots: []
        },
        {
            id: 'pyqgis',
            name: 'PyQGIS Toolkit',
            status: 'Ongoing',
            repo: '',
            demo: '',
            desc: 'Script suite for QGIS 3.x covering batch map capture, style version control, layer schema tools and exports.',
            stack: ['Python', 'PyQGIS', 'PyQt5', 'XlsxWriter', 'openpyxl', 'GeoPackage'],
            features: ['Batch capture of selected features into print-layout composites', 'Layer style backup and restore with .qml history', 'Schema-preserving layer merge and duplicate detection with Excel audit reports', 'Scratch layer export mirroring the layer tree as nested folders'],
            decisions: ['Edit-buffer mode instead of auto-commit', 'Layers identified by ID, not display name'],
            shots: []
        }
    ],
    skills: [{
            name: 'Programming languages',
            items: ['Java', 'Python', 'JavaScript', 'PHP', 'SQL', 'Swift']
        },
        {
            name: 'Frontend development',
            items: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Figma']
        },
        {
            name: 'Backend development',
            items: ['Spring Boot', 'Node.js', 'PHP', 'REST APIs', 'JWT auth', 'JPA', 'MVC', 'Maven']
        },
        {
            name: 'Databases',
            items: ['PostgreSQL', 'MySQL', 'SQL', 'Flyway']
        },
        {
            name: 'Cloud and deployment',
            items: ['Railway']
        },
        {
            name: 'Developer tools',
            items: ['Git', 'Checkstyle', 'SpotBugs', 'JaCoCo', 'OpenAPI / springdoc']
        },
        {
            name: 'GIS and spatial data',
            items: ['QGIS', 'PyQGIS', 'PyQt5', 'Google Maps JS API', 'ShapefileJS', 'GeoPackage']
        },
        {
            name: 'CMS, data and practice',
            items: ['WordPress', 'Drupal', 'Power BI', 'Excel', 'SharePoint', 'Agile', 'TDD', 'OOP', 'Design Patterns']
        }
    ],
    experience: [{
            role: 'Software Development Intern',
            org: 'Corlink Networks (Cape Town)',
            dates: 'Feb 2026 - Present',
            points: ['Build and enhance Python and PyQGIS automation scripts that streamline geospatial workflows and cut manual processing', 'Troubleshoot and optimise GIS applications and workflows', 'Manage and analyse data in PostgreSQL, SharePoint and Excel for reporting and tracking', 'Contributing Java backend functionality to internal applications, by implementing REST APIs and database interactions'],
            tech: ['Python', 'PyQGIS', 'Java', 'SQL', 'REST APIs', 'PostgreSQL', 'SharePoint', 'Excel']
        },
        {
            role: 'Web Development Intern',
            org: 'African Ideas (Cape Town)',
            dates: 'Jul 2025 - Dec 2025',
            points: ['Built and maintained responsive CMS websites in WordPress and Drupal', 'Developed PHP backend functionality and dynamic JavaScript features', 'Integrated third-party services through REST APIs', 'Collaborated in a team using Git'],
            tech: ['WordPress', 'Drupal', 'PHP', 'JavaScript', 'REST APIs', 'Git']
        },
        {
            role: 'Sales Assistant (Christmas Casual)',
            org: 'Cotton On',
            dates: 'Nov 2022 - Jan 2023',
            points: ['Helped customers with product selection and handled POS transactions, returns and exchanges', 'Contributed to daily and weekly sales targets during peak trading'],
            tech: []
        }
    ],
    education: [{
            qualification: 'Diploma in ICT',
            field: 'Applications Development',
            institution: 'Cape Peninsula University of Technology',
            dates: 'Feb 2023 - Dec 2025',
            coursework: ['Java & Spring Boot (REST APIs, MVC)', 'Database Systems & SQL', 'Data Analytics & BI (Power BI, Python, SQL)', 'Web Development (Node.js, React.js)', 'Software Engineering (Agile, TDD, Design Patterns)']
        },
        {
            qualification: 'National Senior Certificate (Matric)',
            field: '',
            institution: 'Dr JL Dube High School',
            dates: '2022',
            coursework: []
        }
    ],
    certs: []
};