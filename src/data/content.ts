export interface Experience {
  role: string;
  company: string;
  companyUrl?: string;
  date: string;
  year: string;
  bullets: string[];
  featuredLink?: { label: string; url: string };
  /** Older roles render more compactly to keep the timeline skimmable. */
  compact?: boolean;
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
  outcome: string;
  badges: string[];
  github: string;
  role?: string;
}

export const identity = {
  name: "Shreemit Garimella",
  firstName: "SHREEMIT",
  lastName: "GARIMELLA",
  role: "AI Engineer",
  proof: "Building LLM case intelligence at Axon",
  tagline: "Production semantic search, evaluation pipelines, and full-stack AI systems",
  email: "shreemit27@gmail.com",
  github: "https://github.com/shreemit",
  linkedin: "https://linkedin.com/in/shreemit",
  resume: "/resume.pdf",
  portrait: "/images/portrait.webp",
  portraitWidth: 800,
  portraitHeight: 1200,
  location: "Seattle, WA",
  siteUrl: "https://shreemit.github.io/",
  ogImage: "https://shreemit.github.io/og.jpg",
  contactKicker: "05 / HIRING FOR APPLIED AI OR SEARCH?",
};

export const about = {
  paragraphs: [
    "I ship the unglamorous parts of production AI: multi-turn retrieval services, synthetic evaluation data, rubric-based quality harnesses, and the load paths that keep them honest under real traffic.",
    "Before Axon I built healthcare ML and consumer products across Swift, PyTorch, and AWS — from cervical-cancer screening models to an EHR app that reached 8,000+ active users.",
    "Open to AI/ML engineering roles focused on LLM systems, evaluation, and applied ML — especially where search quality and real-world impact matter.",
  ],
};

export const skillGroups = [
  {
    label: "Languages",
    items: ["Python", "Go", "TypeScript", "Swift", "SQL"],
  },
  {
    label: "Frameworks",
    items: [
      "PyTorch",
      "Hugging Face",
      "LangChain",
      "OpenAI",
      "TensorFlow",
      "Scikit-learn",
      "React",
      "Flask",
      "Pandas",
      "NLTK",
    ],
  },
  {
    label: "Tools",
    items: [
      "Docker",
      "AWS",
      "Azure",
      "Weights & Biases",
      "Pinecone",
      "Airflow",
      "MongoDB",
      "DynamoDB",
      "Git",
      "Linux",
    ],
  },
];

export const experience: Experience[] = [
  {
    role: "Software Engineer",
    company: "Axon",
    companyUrl: "https://www.axon.com",
    date: "Feb 2025 — Present",
    year: "2025",
    bullets: [
      "Led a Go microservice for LLM-powered semantic search over case data, managing multi-turn context to surface links via shared identifiers, behavioral patterns, and narrative similarity.",
      "Built a synthetic crime-report pipeline with intentionally seeded connections, giving Case Compass ground-truth data for link-detection evaluation.",
      "Shipped a rubric-based testing harness that scores discovered case connections against structured criteria and produces interpretable quality metrics.",
      "Stood up sandboxed eval environments with controlled model access and full-stack stress tests to validate reliability under load.",
    ],
  },
  {
    role: "Full Stack Software Engineer",
    company: "MOJO AI Tech",
    date: "Dec 2024 — Jan 2025",
    year: "2024",
    bullets: [
      "Built a conversational AI companion with preference memory and history-aware replies across a TypeScript/Python stack.",
      "Implemented session context so multi-turn chats stayed coherent instead of single-shot prompts.",
    ],
  },
  {
    role: "Teaching Assistant: LLMs",
    company: "University of Washington",
    companyUrl: "https://www.washington.edu",
    date: "Dec 2023 — Mar 2024",
    year: "2023",
    compact: true,
    bullets: [
      "Designed LLM coding assignments and projects for real-world scenarios in collaborative coursework.",
    ],
  },
  {
    role: "Machine Learning Research Intern",
    company: "Global Health Labs",
    date: "Jun 2023 — Sept 2023",
    year: "2023",
    bullets: [
      "Trained cervical-cancer screening CV models with ablation studies and W&B MLOps pipelines, reaching 94% accuracy.",
      "Built a GradCAM embedding projector to visualize class interactions and improve classification decisions.",
    ],
  },
  {
    role: "Machine Learning Capstone",
    company: "NanoString",
    companyUrl: "https://nanostring.com/",
    date: "Jan 2023 — Jun 2023",
    year: "2023",
    compact: true,
    bullets: [
      "Trained a PyTorch U-Net for RNA tissue analysis, improving prediction accuracy 40% vs. classical image processing.",
      "Used transfer learning across four color-emission PSFs to cut training time and compute.",
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
      "Led Resolute (Swift/MVVM): secure EHR storage and AI preventive care — 8,000+ active users, 4.7★ App Store rating.",
      "Shipped privacy-preserving patient APIs on DynamoDB, Lambda, Amplify, and Cognito for auth and access control.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "HumanFractal",
    companyUrl: "https://www.humanfractal.ai/",
    date: "Nov 2020 — Feb 2021",
    year: "2020",
    compact: true,
    bullets: [
      "Built an Amazon Lex + Lambda appointment chatbot that reduced hospital scheduling workload by ~20%.",
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
      "RAG chatbot that recommends apartments from natural-language preferences using embeddings and vector search.",
    outcome:
      "Indexed listings with OpenAI embeddings + Pinecone; LangChain retrieval returns preference-matched apartments in a single conversational turn.",
    role: "Solo project",
    badges: ["OpenAI", "LangChain", "Pinecone", "Vector DB"],
    github: "https://github.com/shreemit/LeaseGPT",
  },
  {
    title: "Handwritten Notes Captioning",
    description:
      "Multimodal model that captions handwritten student assignments with parameter-efficient fine-tuning.",
    outcome:
      "LoRA-adapted a vision-language model for assignment captioning — trainable on consumer GPUs without full-model fine-tunes.",
    role: "Solo / research",
    badges: ["LoRA", "Multimodal ML", "Computer Vision", "NLP"],
    github: "https://github.com/shreemit/handwritten-notes-captioning",
  },
  {
    title: "Recipe Generator",
    description:
      "Seq2seq T5 model fine-tuned to generate novel recipes from ingredient lists.",
    outcome:
      "Fine-tuned T5 on 1M+ recipes; evaluated generative quality across ingredient-to-recipe prompts at scale.",
    role: "Solo project",
    badges: ["PyTorch", "Hugging Face", "NLP", "Transformers"],
    github: "https://github.com/shreemit/RecipeGeneratorNLP",
  },
  {
    title: "ViT Mixture of Experts",
    description:
      "Vision Transformer with dynamic expert routing for CIFAR-10 classification.",
    outcome:
      "Benchmarked MoE routing vs. dense ViT baselines on CIFAR-10 to quantify accuracy vs. compute tradeoffs.",
    role: "Solo / research",
    badges: ["PyTorch", "Computer Vision", "Transformers", "ML"],
    github: "https://github.com/shreemit/ViT-MoE",
  },
  {
    title: "Movie Recommendation Engine",
    description:
      "Hybrid recommender combining collaborative and content-based filtering.",
    outcome:
      "Compared collaborative, content-based, and hybrid ranking strategies with systematic evaluation of recommendation quality.",
    role: "Solo project",
    badges: ["Python", "ML", "Recommendation Systems", "Data Analysis"],
    github: "https://github.com/shreemit/movie-recs",
  },
];
