const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Profile = require('./models/Profile');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Learning = require('./models/Learning');
const SocialLink = require('./models/SocialLink');
const Admin = require('./models/Admin');

// Raw static data matching constants.js structure
const Bio = {
  name: "Saffi Ullah",
  roles: [
    "Full Stack Developer",
    "ML/AI Engineer",
    "Software Engineer",
    "Programmer",
  ],
  description:
    "Passionate Software Engineering student skilled in MERN Stack Development and Artificial Intelligence. Over 1 year of hands-on experience building AI models and full-stack web applications using modern frameworks. Dedicated to creating intelligent, user-centered, and efficient digital solutions integrating deep learning with web technologies.",
  github: "https://github.com/saffiullah1314",
  resume: "https://drive.google.com/file/d/17fbhf3GRIwbPLxK_mAbyc3snlM1H1nZF/view",
  linkedin: "https://www.linkedin.com/in/saffi-ullah-865819339/",
  insta: "https://www.instagram.com/saffiullah1314",
  facebook: "https://www.facebook.com/saffiullah1314/",
};

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    // Clear existing data
    await Profile.deleteMany();
    await Skill.deleteMany();
    await Project.deleteMany();
    await Experience.deleteMany();
    await Education.deleteMany();
    await Learning.deleteMany();
    await SocialLink.deleteMany();
    console.log('✅ Old data cleared');

    // 1. Profile
    await Profile.create({
      name: Bio.name,
      roles: Bio.roles,
      description: Bio.description,
      resume: Bio.resume
    });
    console.log('✅ Profile seeded');

    // 2. Social Links
    const socialLinks = [
      { platform: 'github', url: Bio.github, order: 1, visible: true },
      { platform: 'linkedin', url: Bio.linkedin, order: 2, visible: true },
      { platform: 'insta', url: Bio.insta, order: 3, visible: true },
      { platform: 'facebook', url: Bio.facebook, order: 4, visible: true }
    ];
    await SocialLink.insertMany(socialLinks.filter(s => s.url));
    console.log('✅ Social Links seeded');

    // 3. Skills (categories - keeping image URLs as-is from constants)
    const skillCategories = [
      {
        title: "Frontend",
        skills: [
          { name: "React Js", image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", order: 1 },
          { name: "Tailwind CSS", image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg", order: 2 },
          { name: "HTML", image: "https://www.w3.org/html/logo/badge/html5-badge-h-solo.png", order: 3 },
          { name: "CSS", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1452px-CSS3_logo_and_wordmark.svg.png", order: 4 },
          { name: "JavaScript", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/800px-JavaScript-logo.png", order: 5 },
          { name: "Bootstrap", image: "https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png", order: 6 },
          { name: "Material UI", image: "https://mui.com/static/logo.png", order: 7 }
        ],
        order: 1
      },
      {
        title: "Backend",
        skills: [
          { name: "Node Js", image: "https://nodejs.org/static/images/logo.svg", order: 1 },
          { name: "Express Js", image: "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png", order: 2 },
          { name: "Graph Ql", image: "https://www.vectorlogo.zone/logos/graphql/graphql-icon.svg", order: 3 },
          { name: "Python", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg", order: 4 },
          { name: "MySQL", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg", order: 5 },
          { name: "MongoDB", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg", order: 6 }
        ],
        order: 2
      },
      {
        title: "Machine Learning",
        skills: [
          { name: "Python", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg", order: 1 },
          { name: "TensorFlow", image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg", order: 2 },
          { name: "Keras", image: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Keras_logo.svg", order: 3 },
          { name: "Jupyter", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Jupyter_logo.svg/1767px-Jupyter_logo.svg.png", order: 4 },
          { name: "Google Colab", image: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Colaboratory_SVG_Logo.svg", order: 5 },
          { name: "Scikit-Learn", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Scikit_learn_logo_small.svg/2560px-Scikit_learn_logo_small.svg.png", order: 6 },
          { name: "OpenCV", image: "https://upload.wikimedia.org/wikipedia/commons/3/32/OpenCV_Logo_with_text_svg_version.svg", order: 7 },
          { name: "FastAPI", image: "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png", order: 8 }
        ],
        order: 3
      },
      {
        title: "Others",
        skills: [
          { name: "Git", image: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png", order: 1 },
          { name: "GitHub", image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png", order: 2 },
          { name: "VS Code", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/512px-Visual_Studio_Code_1.35_icon.svg.png", order: 3 },
          { name: "Postman", image: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg", order: 4 },
          { name: "Figma", image: "https://s3-alpha.figma.com/hub/file/1481185752/fa4cd070-6a79-4e1b-b079-8b9b76408595-cover.png", order: 5 }
        ],
        order: 4
      }
    ];
    await Skill.insertMany(skillCategories);
    console.log('✅ Skills seeded');

    // 4. Projects (using field names matching the DB model)
    const projectsData = [
      { title: "Face Mask Detection App", date: "2025", description: "Detects whether a person is wearing a mask or not using a CNN model trained on image data. Built with TensorFlow/Keras and integrated via Streamlit for real-time predictions.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["CNN", "TensorFlow", "Keras", "Streamlit", "Image Processing"], category: "machine learning", github: "https://github.com/saffiullah1314/face-mask-detection", webapp: "", order: 1 },
      { title: "CIFAR-10 Object Detection", date: "2025", description: "Trained and deployed a CNN model on the CIFAR-10 dataset with real-time image upload & prediction through Streamlit UI.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["CNN", "TensorFlow", "Keras", "Streamlit"], category: "machine learning", github: "https://github.com/saffiullah1314/CFIR", webapp: "https://cfir7z.streamlit.app/", order: 2 },
      { title: "MNIST Digit Recognition", date: "2025", description: "Interactive web app that predicts handwritten digits using a CNN trained on MNIST dataset, featuring dark mode and confidence scoring.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["CNN", "TensorFlow", "Keras", "Streamlit"], category: "machine learning", github: "https://github.com/saffiullah1314/MNIST-Digit", webapp: "", order: 3 },
      { title: "Breast Cancer Prediction", date: "2025", description: "Predicts tumor types (Benign or Malignant) using Breast Cancer Wisconsin dataset. Integrated with an interactive dark-themed Streamlit UI.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["ML", "TensorFlow", "Pandas", "Streamlit"], category: "machine learning", github: "https://github.com/saffiullah1314/Breast-Cancer", webapp: "https://breast-cancer-duy6acnihhgm5ywgmfxvjv.streamlit.app/", order: 4 },
      { title: "Face, Eyes & Smile Detection App", date: "2025", description: "Detects Faces, Eyes, and Smiles in real-time using webcam. Includes a simple Tkinter UI to start/stop camera and FPS display.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["OpenCV", "Python", "Tkinter", "Real-time Detection"], category: "machine learning", github: "https://github.com/saffiullah1314/Face-Eyes-Smile-Detection-App", webapp: "", order: 5 },
      { title: "YOLOv8 Object Detection Project", date: "2025", description: "Detects objects in images and videos in real-time using YOLOv8 deep learning model. Backend API with FastAPI and frontend interface for uploading files.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["Python", "FastAPI", "OpenCV", "YOLOv8", "HTML/CSS", "Real-time Detection"], category: "machine learning", github: "https://github.com/saffiullah1314/Yolo-Fastapi-Project", webapp: "", order: 6 },
      { title: "URL Shortener", date: "2024", description: "Full-stack URL shortener with user login, protected routes, and dashboard for managing short links. Built using Node.js, Express.js, MongoDB, and EJS.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["Node.js", "Express", "MongoDB", "EJS", "Auth"], category: "web app", github: "https://github.com/saffiullah1314/Url-Shortner", webapp: "https://saffi-url-shortner-mern.vercel.app/user/signin", order: 7 },
      { title: "Edusity Educational Web Application", date: "2025", description: "A fully responsive educational web app built with React.js. Provides program information, modern UI, and a working contact form.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["React.js", "Tailwind CSS", "Responsive Design", "Frontend Development"], category: "web app", github: "https://github.com/saffiullah1314/Edusity", webapp: "https://saffiullah1314.github.io/Edusity/", order: 8 },
      { title: "Real Estate Web Application", date: "2025", description: "A modern, fully responsive frontend-only real estate web app template.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["React.js", "Tailwind CSS", "SPA", "Responsive Design"], category: "web app", github: "https://github.com/saffiullah1314/Real-Estate", webapp: "https://saffiullah1314.github.io/Real-Estate/", order: 9 },
      { title: "Snake Game", date: "2023", description: "A classic Snake Game with live scoring, food effects, and smooth UI animations.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["HTML", "CSS", "JavaScript"], category: "web app", github: "https://github.com/saffiullah1314/Snake-Game", webapp: "https://saffiullah1314.github.io/Snake-Game/", order: 10 },
      { title: "Tic Tac Toe Game", date: "2023", description: "Fully responsive 2-player Tic Tac Toe with 3D visuals, turn-based animations, and restart feature.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["HTML", "CSS", "JavaScript"], category: "web app", github: "https://github.com/saffiullah1314/Tic-Tac-Toe/", webapp: "https://saffiullah1314.github.io/Tic-Tac-Toe/", order: 11 },
      { title: "Rock Paper Scissors Game", date: "2023", description: "Fun and animated Rock Paper Scissors game with random computer moves and responsive design.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["HTML", "CSS", "JavaScript"], category: "web app", github: "https://github.com/saffiullah1314/Rock-Paper-Scissors/", webapp: "https://saffiullah1314.github.io/Rock-Paper-Scissors/", order: 12 },
      { title: "Currency Converter", date: "2023", description: "Responsive currency converter using live API exchange rates with clean UI and instant results.", image: "https://upload.wikimedia.org/wikipedia/commons/0/06/Sign_of_the_Horns_Emoji.png", tags: ["JavaScript", "API", "HTML", "CSS"], category: "web app", github: "https://github.com/saffiullah1314/Currency-Converter/", webapp: "https://saffiullah1314.github.io/Currency-Converter/", order: 13 }
    ];
    await Project.insertMany(projectsData.map(p => ({ ...p, visible: true, featured: false })));
    console.log('✅ Projects seeded');

    // 5. Experience
    const experiencesData = [
      {
        role: "MERN Stack Developer (Independent Projects)",
        company: "Independent",
        date: "Aug 2024 - Feb 2025",
        desc: "Developed full-stack web applications using the MERN stack including MongoDB, Express.js, React.js, and Node.js. Built responsive user interfaces with Tailwind CSS and Bootstrap, implemented REST APIs, and handled authentication with JWT.",
        skills: ["ReactJS", "NodeJS", "MongoDB", "ExpressJS", "Tailwind CSS", "Bootstrap", "JavaScript (ES6+)"],
        order: 1,
        visible: true
      },
      {
        role: "AI / ML Developer (Independent Projects)",
        company: "Independent",
        date: "Feb 2025 - Present",
        desc: "Focused on building and deploying intelligent AI/ML models using Python, TensorFlow, Keras, and OpenCV. Worked on Deep Learning architectures including CNNs, RNNs, LSTM, GRU, and Transfer Learning.",
        skills: ["Python", "TensorFlow", "Keras", "OpenCV", "CNN", "RNN", "LSTM", "Transfer Learning"],
        order: 2,
        visible: true
      },
      {
        role: "Full Stack Developer | AI & Automation",
        company: "Internify — Client Project",
        date: "Summer 2026 (Approx. 2.5 months)",
        desc: "Internify is an internship discovery platform designed to help Pakistani students find internship opportunities from different online sources in one centralized place.\n\nKey contributions:\n• Web application development\n• Mobile application development\n• MERN stack development\n• Backend development & Database integration\n• API integration\n• AI-powered automation for internship detection\n• Automated collection and organization of relevant internship opportunities\n• Reducing manual internship data entry",
        skills: ["MERN Stack", "React", "Node.js", "MongoDB", "AI Automation", "REST APIs"],
        order: 3,
        visible: true
      }
    ];
    await Experience.insertMany(experiencesData);
    console.log('✅ Experience seeded');

    // 6. Education
    const educationData = [
      {
        school: "COMSATS University Islamabad",
        date: "Sep 2025 - Present",
        grade: "In Progress",
        desc: "Currently pursuing a Bachelor's degree in Software Engineering at COMSATS University Islamabad. Actively focusing on AI and MERN Stack development, with hands-on projects and continuous learning in modern software technologies.",
        degree: "Bachelor of Science - BS, Software Engineering",
        order: 1,
        visible: true
      },
      {
        school: "Jinnah Education System, FBISE",
        date: "2022 - 2024",
        grade: "880 / 1100",
        desc: "Completed Intermediate in Computer Science (F.Sc ICS) with a strong foundation in programming, data structures, and mathematics.",
        degree: "F.Sc (ICS), Computer Science",
        order: 2,
        visible: true
      },
      {
        school: "Jinnah Education System",
        date: "2020 - 2022",
        grade: "Completed",
        desc: "Completed Matriculation in Computer Science with strong interest in logic building and technology fundamentals.",
        degree: "Matriculation, Computer Science",
        order: 3,
        visible: true
      }
    ];
    await Education.insertMany(educationData);
    console.log('✅ Education seeded');

    // 7. Learning (CampusX Deep Learning - Self-Learning)
    await Learning.create({
      title: 'Deep Learning (Self-Study)',
      provider: 'CampusX YouTube',
      type: 'Self-Learning',
      date: '2025 - Present',
      desc: 'Self-study journey through CampusX YouTube channel covering foundational to advanced Deep Learning concepts. NOTE: This is self-learning through YouTube and is NOT an officially issued CampusX certificate.',
      topics: [
        'ANN', 'MLP', 'Perceptron', 'Backpropagation', 'Gradient Descent',
        'Vanishing Gradient', 'Activation Functions', 'Regularization', 'Dropout',
        'Early Stopping', 'Keras Tuner', 'CNN', 'Stride', 'Padding', 'Pooling',
        'CNN Backpropagation', 'Data Augmentation', 'Transfer Learning',
        'Keras Functional API', 'RNN', 'RNN Forward Propagation', 'RNN Backpropagation',
        'LSTM', 'GRU', 'Deep RNN', 'Bidirectional RNN', 'Encoder-Decoder',
        'Sequence-to-Sequence', 'Bahdanau Attention', 'Luong Attention', 'Transformers',
        'Self-Attention', 'Positional Encoding', 'Masked Self-Attention',
        'Cross-Attention', 'Transformer Architecture'
      ],
      url: 'https://youtube.com/@campusx-official',
      order: 1,
      visible: true
    });
    console.log('✅ Learning seeded');

    // 8. Admin user
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminExists) {
        await Admin.create({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD
        });
        console.log('✅ Admin user created');
      } else {
        console.log('ℹ️  Admin already exists, skipping');
      }
    }

    console.log('\n🎉 All data seeded successfully!\n');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('\n💡 Note: Make sure MongoDB is running and MONGODB_URI is correctly set in server/.env');
  process.exit(1);
});
