export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  date: string;
  year: string;
  bullets: string[];
  featuredLink?: { label: string; url: string };
}

export interface Education {
  degree: string;
  school: string;
  date: string;
  courses: string[];
}

export interface Project {
  title: string;
  description: string;
  image: string;
  badges: string[];
  github: string;
}

export const identity = {
  name: "Shreemit Garimella",
  firstName: "SHREEMIT",
  lastName: "GARIMELLA",
  role: "AI Engineer",
  tagline: "Bridging Machine Learning and User-Centric Technologies",
  email: "shreemit27@gmail.com",
  github: "https://github.com/shreemit",
  linkedin: "https://linkedin.com/in/shreemit",
  resume:
    "https://drive.google.com/file/d/1hh3OAL_ARGo8wWrwPhBQCODGeq-iGOnz/view?usp=sharing",
  portrait: "/images/portrait.jpg",
};

export const about = {
  paragraphs: [
    "Hey there! I'm currently at Axon building LLM-powered systems for semantic search and case intelligence — from Go microservices that manage multi-turn context to evaluation pipelines that validate AI quality at scale.",
    "Whether I'm building AI-powered healthcare apps, training computer vision models, or shipping conversational AI products, I'm all about solving real-world problems with code.",
    "My goal? To build technology that not only looks good on paper but actually makes a difference in people's lives.",
  ],
};

export const skillGroups = [
  {
    label: "Languages",
    items: [
      "Python",
      "Java",
      "JavaScript",
      "TypeScript",
      "Go",
      "Swift",
      "SQL",
      "C++",
      "C",
    ],
  },
  {
    label: "Frameworks",
    items: [
      "PyTorch",
      "React",
      "Scikit-learn",
      "NLTK",
      "TensorFlow",
      "Keras",
      "Flask",
      "Airflow",
      "Pandas",
      "Matplotlib",
      "HuggingFace",
    ],
  },
  {
    label: "Tools",
    items: [
      "Git",
      "Docker",
      "Jira",
      "AWS",
      "Azure",
      "Weights & Biases",
      "MongoDB",
      "MySQL",
      "Tableau",
      "SQLite",
    ],
  },
];

export const skills = skillGroups.flatMap((g) => g.items);

export const experience: Experience[] = [
  {
    role: "Software Engineer",
    company: "Axon",
    companyUrl: "https://www.axon.com",
    date: "Feb 2025 — Present",
    year: "2025",
    bullets: [
      "Led the design and architecture of a Go microservice that uses LLM-powered semantic search to query a case database, managing context across multi-turn interactions to surface connections between crime cases via shared identifiers, behavioral patterns, and narrative similarities.",
      "Built a synthetic crime report generation pipeline to produce realistic police case data with intentionally seeded connections, enabling ground-truth evaluation of Case Compass's link-detection engine.",
      "Developed a rubric-based testing harness that evaluates discovered case connections against structured scoring criteria, producing interpretable quality metrics to validate the AI search core.",
      "Established sandboxed evaluation environments with controlled model access, stress testing the full stack to validate system reliability under load.",
    ],
  },
  {
    role: "Full Stack Software Engineer",
    company: "MOJO AI Tech",
    date: "Dec 2024 — Jan 2025",
    year: "2024",
    bullets: [
      "Built a conversational AI companion that engages users in natural language interactions, personalizing responses based on user preferences and conversation history.",
    ],
  },
  {
    role: "Teaching Assistant: LLMs",
    company: "University of Washington",
    companyUrl: "https://www.washington.edu",
    date: "Dec 2023 — Mar 2024",
    year: "2023",
    bullets: [
      "Designed coding assignments and projects applying LLMs to real-world scenarios, supporting student understanding of modern AI techniques through hands-on, collaborative coursework.",
    ],
  },
  {
    role: "Machine Learning Research Intern",
    company: "Global Health Labs",
    date: "Jun 2023 — Sept 2023",
    year: "2023",
    bullets: [
      "Trained computer vision ML models by conducting an ablation study and building MLOps pipelines using Weights and Biases to enable fast experimentation and comparisons for cervical cancer screening, achieving an accuracy of 94%.",
      "Developed an embedding projector tool utilizing semantic maps using GradCAM to visualize data interactions within class labels and improve the cervical cancer classification model's predictions.",
    ],
  },
  {
    role: "Machine Learning Capstone",
    company: "NanoString",
    companyUrl: "https://nanostring.com/",
    date: "Jan 2023 — Jun 2023",
    year: "2023",
    bullets: [
      "Trained a custom deep learning U-Net architecture using PyTorch for RNA tissue sample analysis.",
      "Improved prediction accuracy by 40% compared to traditional image processing methods.",
      "Implemented transfer learning strategy to expedite RNA molecule identification across four color emission PSFs.",
      "Reduced training time and computational resource requirements.",
    ],
  },
  {
    role: "Software Developer",
    company: "HumanFractal",
    companyUrl: "https://www.humanfractal.ai/",
    date: "Mar 2021 — Jun 2022",
    year: "2021",
    featuredLink: {
      label: "Resolute on the App Store",
      url: "https://apps.apple.com/in/app/resolute/id1570787708",
    },
    bullets: [
      "Led the design and development of Resolute using Swift with MVVM architecture, which facilitated secure EHR data storage and offered AI-powered preventive care — leading to over 8000 active users and a 4.7-star rating.",
      "Built privacy-preserving patient record services in DynamoDB via REST APIs using AWS Lambda and Amplify, establishing user trust through secure, compliant data handling.",
      "Implemented user authentication and access management using Amazon Cognito, reducing security overhead and improving development velocity for the team.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "HumanFractal",
    companyUrl: "https://www.humanfractal.ai/",
    date: "Nov 2020 — Feb 2021",
    year: "2020",
    bullets: [
      "Developed an interactive chatbot using Amazon Lex and AWS Lambda to streamline hospital appointment scheduling, reducing hospital workloads by 20%.",
      "Optimized scalability and reliability with serverless Lambda functions fetching appointments through a RESTful API.",
    ],
  },
];

export const education: Education[] = [
  {
    degree: "MS, Electrical & Computer Engineering",
    school: "University of Washington, Seattle",
    date: "Sept 2022 — Aug 2024",
    courses: [
      "Biomedical Applications of LLMs",
      "Natural Language Processing",
      "Deep Learning",
      "TinyML",
      "Explainable AI",
    ],
  },
  {
    degree: "BE, Electronics & Communication Engineering",
    school: "Visvesvaraya Technological University (BMSIT)",
    date: "Aug 2017 — Jul 2021",
    courses: [
      "Python Application Programming",
      "Artificial Neural Networks",
      "Operating Systems",
    ],
  },
];

export const projects: Project[] = [
  {
    title: "LeaseGPT",
    description:
      "A personalized apartment search chatbot utilizing advanced AI technologies to provide tailored recommendations based on user needs.",
    image: "/images/leasegpt.jpeg",
    badges: ["OpenAI", "LangChain", "Pinecone", "Vector DB"],
    github: "https://github.com/shreemit/LeaseGPT",
  },
  {
    title: "ViT Mixture of Experts",
    description:
      "Advanced computer vision model optimizing performance on CIFAR-10 through dynamic expert selection and enhanced accuracy.",
    image: "/images/moe.webp",
    badges: ["PyTorch", "Computer Vision", "Transformers", "ML"],
    github: "https://github.com/shreemit/ViT-MoE",
  },
  {
    title: "Recipe Generator",
    description:
      "Seq2seq T5 model fine-tuned on over 1 million recipes, generating novel recipes from ingredient lists using advanced NLP techniques.",
    image: "/images/recipe.jpeg",
    badges: ["PyTorch", "Hugging Face", "NLP", "Transformers"],
    github: "https://github.com/shreemit/RecipeGeneratorNLP",
  },
  {
    title: "Handwritten Notes Captioning",
    description:
      "Multimodal machine learning model using Low-Rank Adaptation (LoRA) for efficient annotation of handwritten student assignments.",
    image: "/images/lora.jpeg",
    badges: ["LoRA", "Multimodal ML", "Computer Vision", "NLP"],
    github: "https://github.com/shreemit/handwritten-notes-captioning",
  },
  {
    title: "Movie Recommendation Engine",
    description:
      "Comprehensive recommendation engine leveraging collaborative and content-based filtering with rigorous performance evaluation.",
    image: "/images/movies.jpeg",
    badges: ["Python", "ML", "Recommendation Systems", "Data Analysis"],
    github: "https://github.com/shreemit/movie-recs",
  },
];
