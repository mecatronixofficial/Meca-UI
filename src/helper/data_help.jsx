// src/helper/data.jsx
import React from "react";
import {
    FaCode,
    FaMobile,
    FaPalette,
    FaCloud,
    FaRobot,
    FaShoppingCart,
    FaGlobe,
    FaLaptopCode,
    FaCogs,
    FaTools,
    FaUserTie,
    FaServer,
    FaRedo,
    FaSearch,
    FaMobileAlt,
    FaPaintBrush,
    FaExchangeAlt,
    FaShieldAlt,
    FaChartLine,
    FaLightbulb,
    FaCheckCircle,
    FaRocket,
    FaHandshake,
    FaBrain,
    FaDatabase,
    FaUsers,
    FaGlobeAmericas,
    FaFingerprint,
    FaAward,
    FaHeart,
    FaStar,
    FaRegClock,
    FaInfinity,
    FaBolt,
} from "react-icons/fa";


// components

export const NAV = [
    { id: '/', label: 'Portal' },
    { id: '/ourworld', label: 'Our World' },
    { id: '/services', label: 'Services' },
    { id: '/portfolio', label: 'Portfolio' },
    { id: '/openline', label: 'Open Line' },
];

export const subtitles = ["Technology", "Automation", "Future", "Innovation", "Excellence"];


// portal 


export const Top_Servicess = [
    {
        id: 1,
        icon: <FaCode className="text-3xl" />,
        title: "Web Development",
        description: "Custom web applications built with modern technologies like React, Next.js, and Node.js for optimal performance and scalability.",
        features: ["Responsive Design", "Progressive Web Apps", "API Integration", "Performance Optimization", "E-commerce Solutions", "CMS Development"],
        color: "from-blue-500 to-cyan-600",
        bgImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
        stats: "500+ Projects"
    },
    {
        id: 2,
        icon: <FaMobile className="text-3xl" />,
        title: "Mobile Development",
        description: "Native and cross-platform mobile apps for iOS and Android with seamless user experiences and native performance.",
        features: ["React Native", "Flutter", "Native iOS/Android", "App Store Deployment", "Push Notifications", "Offline Support"],
        color: "from-green-500 to-emerald-600",
        bgImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop",
        stats: "300+ Apps"
    },
    {
        id: 3,
        icon: <FaPalette className="text-3xl" />,
        title: "UI/UX Design",
        description: "Beautiful, intuitive designs that enhance user engagement, drive conversions and create memorable brand experiences.",
        features: ["User Research", "Wireframing", "Prototyping", "Design Systems", "User Testing", "Brand Identity"],
        color: "from-purple-500 to-pink-600",
        bgImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
        stats: "4.9★ Rating"
    },
    {
        id: 4,
        icon: <FaCloud className="text-3xl" />,
        title: "Cloud Solutions",
        description: "Scalable cloud infrastructure and deployment solutions that grow with your business needs.",
        features: ["AWS/Azure/GCP", "DevOps", "CI/CD Pipelines", "Serverless Architecture", "Microservices", "Kubernetes"],
        color: "from-orange-500 to-red-600",
        bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
        stats: "24/7 Support"
    },
    {
        id: 5,
        icon: <FaRobot className="text-3xl" />,
        title: "AI & ML Solutions",
        description: "Intelligent solutions leveraging artificial intelligence and machine learning to automate and optimize processes.",
        features: ["Predictive Analytics", "Chatbots", "Computer Vision", "NLP", "Recommendation Systems", "Automation"],
        color: "from-indigo-500 to-purple-600",
        bgImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
        stats: "AI-Powered"
    },
    {
        id: 6,
        icon: <FaShoppingCart className="text-3xl" />,
        title: "E-commerce Solutions",
        description: "Complete e-commerce platforms with secure payments, inventory management, and seamless user journeys.",
        features: ["Online Stores", "Payment Integration", "Inventory Management", "Analytics", "Mobile Commerce", "Security"],
        color: "from-teal-500 to-green-600",
        bgImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop",
        stats: "98% Uptime"
    }
];

export const techCategories = [
    {
        id: "FRONT_END",
        category: "Frontend_Engine",
        icon: <FaBolt />,
        color: "border-blue-500/50 text-blue-400",
        technologies: ["React", "Next.js", "TypeScript", "Tailwind", "Three.js", "WebGL"]
    },
    {
        id: "BACK_END",
        category: "Backend_Core",
        icon: <FaServer />,
        color: "border-emerald-500/50 text-emerald-400",
        technologies: ["Node.js", "Python", "Java", "Django", "Spring Boot", "GraphQL"]
    },
    {
        id: "DATA_STRUC",
        category: "Data_Infrastructure",
        icon: <FaDatabase />,
        color: "border-purple-500/50 text-purple-400",
        technologies: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "DynamoDB", "Firebase"]
    },
    {
        id: "CLOUD_OPS",
        category: "Cloud_Deployment",
        icon: <FaRocket />,
        color: "border-orange-500/50 text-orange-400",
        technologies: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Azure"]
    },
];


// clients


export const glowColors = {
    red: "rgba(239, 68, 68, 0.5)",
    orange: "rgba(249, 115, 22, 0.5)",
    blue: "rgba(59, 130, 246, 0.5)",
    black: "rgba(255, 255, 255, 0.1)",
    purple: "rgba(168, 85, 247, 0.5)",
    pink: "rgba(236, 72, 153, 0.5)"
};

export const spaceThemes = [
    {
        border: "hover:border-orange-400/30",
        title: "group-hover/card:text-orange-300",
        line: "bg-orange-400/30",
        star: "text-orange-400",
        glow: "bg-orange-400/20",
    },
    {
        border: "hover:border-violet-400/30",
        title: "group-hover/card:text-violet-300",
        line: "bg-violet-400/30",
        star: "text-violet-400",
        glow: "bg-violet-400/20",
    },
    {
        border: "hover:border-blue-300/30",
        title: "group-hover/card:text-blue-200",
        line: "bg-blue-300/30",
        star: "text-blue-300",
        glow: "bg-blue-300/20",
    },
];


// our world

export const Our_Features = [
    {
        icon: <FaRocket />,
        title: "Rapid & Reliable Delivery",
        desc: "We ensure timely delivery of high-performance digital products using agile methods.",
        color: "from-orange-500 to-red-500",
        stats: "98% On-Time"
    },
    {
        icon: <FaCode />,
        title: "Full-Stack Expertise",
        desc: "From React, Node.js, and MongoDB to AI & automation — we build everything end-to-end.",
        color: "from-blue-500 to-purple-600",
        stats: "50+ Tech Stacks"
    },
    {
        icon: <FaLightbulb />,
        title: "Creative Innovation",
        desc: "We combine creativity with technology to craft innovative digital experiences.",
        color: "from-yellow-500 to-orange-500",
        stats: "100+ Ideas"
    },
    {
        icon: <FaHandshake />,
        title: "Client Collaboration",
        desc: "We partner with you closely, transforming ideas into future-ready solutions.",
        color: "from-green-500 to-emerald-600",
        stats: "95% Retention"
    },
    {
        icon: <FaCloud />,
        title: "Cloud & IoT Solutions",
        desc: "Integrating smart automation, IoT, and scalable cloud systems for modern business.",
        color: "from-cyan-500 to-blue-600",
        stats: "200+ Deployments"
    },
    {
        icon: <FaShieldAlt />,
        title: "Security & Scalability",
        desc: "Prioritizing data protection and performance for enterprise-grade security.",
        color: "from-purple-500 to-pink-600",
        stats: "100% Secure"
    },
    {
        icon: <FaBrain />,
        title: "AI & Machine Learning",
        desc: "Leveraging artificial intelligence to create smart apps that learn and adapt.",
        color: "from-indigo-500 to-purple-600",
        stats: "Smart AI"
    },
    {
        icon: <FaRobot />,
        title: "Automation Solutions",
        desc: "Intelligent automation systems that streamline operations and boost productivity.",
        color: "from-gray-500 to-blue-600",
        stats: "60% Faster"
    },
    {
        icon: <FaDatabase />,
        title: "Big Data Analytics",
        desc: "Transforming raw data into actionable insights with powerful analytics tools.",
        color: "from-red-500 to-pink-600",
        stats: "Data Driven"
    }
];

export const Our_working_lines = [
    {
        icon: <FaCogs />,
        title: "Discovery & Strategy",
        desc: "Understanding your business and defining clear digital goals.",
        details: ["Analysis", "Planning", "Tech Stack"],
        color: "from-orange-500 to-red-500"
    },
    {
        icon: <FaPalette />,
        title: "Design & Prototyping",
        desc: "Creating intuitive interfaces and user experience designs.",
        details: ["UI/UX", "Wireframing", "Prototyping"],
        color: "from-purple-500 to-pink-600"
    },
    {
        icon: <FaLaptopCode />,
        title: "Development",
        desc: "Building powerful applications with rigorous quality assurance.",
        details: ["Coding", "Review", "Optimization"],
        color: "from-blue-500 to-cyan-600"
    },
    {
        icon: <FaServer />,
        title: "Deployment",
        desc: "Ensuring smooth deployment and go-live with support.",
        details: ["CI/CD", "Security", "Launch"],
        color: "from-green-500 to-emerald-600"
    }
];

export const Our_Team = [
    {
        role: "Leadership",
        title: "Visionary Leaders",
        desc: "Led by industry veterans with a deep passion for innovation and excellence.",
        icon: <FaUserTie />,
        color: "from-blue-400 to-blue-600"
    },
    {
        role: "Engineering",
        title: "Tech Experts",
        desc: " skilled team of engineers, developers, and architects building the future.",
        icon: <FaCode />,
        color: "from-purple-400 to-purple-600"
    },
    {
        role: "Creative",
        title: "Design Thinkers",
        desc: "Designers who craft intuitive and beautiful user experiences.",
        icon: <FaPalette />,
        color: "from-pink-400 to-rose-600"
    }
];

export const Our_Values = [
    { icon: <FaUsers />, title: "Collaboration", desc: "Working together with clients as partners.", color: "from-blue-500 to-cyan-600" },
    { icon: <FaChartLine />, title: "Excellence", desc: "Striving for perfection in every project.", color: "from-green-500 to-emerald-600" },
    { icon: <FaGlobeAmericas />, title: "Innovation", desc: "Exploring new technologies to stay ahead.", color: "from-purple-500 to-pink-600" },
    { icon: <FaShieldAlt />, title: "Integrity", desc: "Transparency and honesty in all dealings.", color: "from-orange-500 to-red-500" },
    { icon: <FaFingerprint />, title: "Uniqueness", desc: "Custom solutions, no cookie-cutter templates.", color: "from-orange-500 to-red-500" },
];

export const Our_Stats = [
    { number: "50+", label: "Projects", icon: FaAward, color: "from-orange-500 to-red-500" },
    { number: "98%", label: "Satisfaction", icon: FaHeart, color: "from-pink-500 to-rose-600" },
    { number: "24/7", label: "Support", icon: FaRegClock, color: "from-blue-500 to-cyan-600" },
    { number: "5+", label: "Years", icon: FaStar, color: "from-yellow-500 to-orange-500" },
    { number: "100+", label: "Tech Stack", icon: FaCode, color: "from-purple-500 to-pink-600" },
    { number: "∞", label: "Innovation", icon: FaInfinity, color: "from-green-500 to-emerald-600" }
];

export const Our_tabs = [
    { id: "features", label: "Expertise", icon: FaRocket },
    { id: "process", label: "Process", icon: FaCogs },
    { id: "team", label: "Our Team", icon: FaUsers },
    { id: "values", label: "Values", icon: FaHeart },
];


// services


export const Services_List = [
    { title: 'Single Page Website', desc: 'Perfect for startups, portfolios, or quick landing pages that need a fast launch with maximum impact.', icon: <FaGlobe className="text-3xl" />, category: "development", features: ["Fast Loading", "SEO Ready", "Mobile First", "Analytics"], color: "from-blue-500 to-cyan-600" },
    { title: 'Multi Page Website', desc: 'Professional multi-section websites ideal for businesses, organizations, and agencies with comprehensive content.', icon: <FaLaptopCode className="text-3xl" />, category: "development", features: ["5+ Pages", "Contact Forms", "Blog Ready", "Admin Panel"], color: "from-purple-500 to-pink-600" },
    { title: 'Dynamic Website', desc: 'Websites with admin panels and content management systems for easy updates and dynamic content.', icon: <FaCogs className="text-3xl" />, category: "development", features: ["CMS Integration", "User Management", "Dynamic Content", "Database"], color: "from-green-500 to-emerald-600" },
    { title: 'E-commerce Development', desc: 'Complete online stores with secure checkout, product management, and multiple payment integrations.', icon: <FaShoppingCart className="text-3xl" />, category: "development", features: ["Payment Gateway", "Inventory Management", "Order Tracking", "Security"], color: "from-orange-500 to-red-600" },
    { title: 'Custom Web Applications', desc: 'Tailor-made web apps built with React, Node.js, and MongoDB for your unique business logic and workflows.', icon: <FaTools className="text-3xl" />, category: "development", features: ["Custom Logic", "API Integration", "Real-time Features", "Scalable"], color: "from-indigo-500 to-purple-600" },
    { title: 'Portfolio Websites', desc: 'Personal or creative portfolios that beautifully present your skills, projects, and professional journey.', icon: <FaUserTie className="text-3xl" />, category: "design", features: ["Creative Layouts", "Project Showcase", "Contact Integration", "Blog"], color: "from-pink-500 to-rose-600" },
    { title: 'Business & Corporate Sites', desc: 'High-performance sites that build trust and showcase company services, team, and achievements effectively.', icon: <FaServer className="text-3xl" />, category: "development", features: ["Professional Design", "Service Pages", "Team Section", "Testimonials"], color: "from-gray-500 to-blue-600" },
    { title: 'Website Redesign', desc: 'Transform your old website into a fresh, modern, and mobile-friendly experience that converts visitors.', icon: <FaRedo className="text-3xl" />, category: "design", features: ["Modern Design", "Better UX", "Improved Performance", "SEO Boost"], color: "from-yellow-500 to-orange-600" },
    { title: 'SEO & Optimization', desc: 'Boost your site speed, accessibility, and Google ranking with professional optimization techniques.', icon: <FaSearch className="text-3xl" />, category: "optimization", features: ["Speed Optimization", "SEO Audit", "Content Strategy", "Ranking Boost"], color: "from-teal-500 to-green-600" },
    { title: 'Hosting & Maintenance', desc: 'Managed hosting, security patches, and uptime monitoring to keep your site running smoothly 24/7.', icon: <FaCloud className="text-3xl" />, category: "optimization", features: ["24/7 Monitoring", "Security Updates", "Backup Solutions", "Performance"], color: "from-cyan-500 to-blue-600" },
    { title: 'Responsive Design', desc: 'Seamless user experience across mobile, tablet, and desktop devices with perfect responsiveness.', icon: <FaMobileAlt className="text-3xl" />, category: "design", features: ["Mobile First", "Tablet Optimized", "Touch Friendly", "Fast Loading"], color: "from-blue-500 to-indigo-600" },
    { title: 'UI/UX Enhancement', desc: 'Modern, user-friendly designs focused on engagement, conversions, and exceptional user experience.', icon: <FaPaintBrush className="text-3xl" />, category: "design", features: ["User Research", "Wireframing", "Prototyping", "Usability Testing"], color: "from-purple-500 to-pink-600" },
    { title: 'Website Migration', desc: 'Safely move your existing website to new servers or tech stacks without downtime or data loss.', icon: <FaExchangeAlt className="text-3xl" />, category: "optimization", features: ["Zero Downtime", "Data Migration", "SEO Preservation", "Testing"], color: "from-green-500 to-teal-600" },
    { title: 'Security Implementation', desc: 'Enterprise-grade security measures including SSL, firewalls, and vulnerability assessments.', icon: <FaShieldAlt className="text-3xl" />, category: "optimization", features: ["SSL Certificate", "Security Audit", "Firewall Setup", "Monitoring"], color: "from-red-500 to-pink-600" },
    { title: 'Performance Analytics', desc: 'Comprehensive analytics setup with dashboards, reports, and actionable insights for growth.', icon: <FaChartLine className="text-3xl" />, category: "optimization", features: ["Google Analytics", "Custom Dashboards", "Conversion Tracking", "Reports"], color: "from-orange-500 to-yellow-600" },
    { title: 'API Integration', desc: 'Seamless integration with third-party services, payment gateways, and external platforms.', icon: <FaCode className="text-3xl" />, category: "development", features: ["REST APIs", "Webhooks", "Authentication", "Documentation"], color: "from-indigo-500 to-purple-600" }
];

export const Most_Used_Tech_Stack = [
    { name: 'React.js', icon: '⚛️', category: 'Frontend', color: 'from-cyan-400 to-blue-500' },
    { name: 'Node.js', icon: '🟢', category: 'Backend', color: 'from-green-400 to-emerald-600' },
    { name: 'MongoDB', icon: '🍃', category: 'Database', color: 'from-emerald-500 to-lime-600' },
    { name: 'Express', icon: '⚙️', category: 'Backend', color: 'from-gray-300 to-gray-500' },
    { name: 'Tailwind', icon: '💨', category: 'Frontend', color: 'from-sky-400 to-indigo-500' },
    { name: 'Firebase', icon: '🔥', category: 'Backend', color: 'from-orange-400 to-yellow-500' },
    { name: 'Next.js', icon: '⬛', category: 'Frontend', color: 'from-gray-100 to-gray-400' },
    { name: 'AWS', icon: '☁️', category: 'DevOps', color: 'from-yellow-500 to-orange-600' },
    { name: 'TypeScript', icon: '🔷', category: 'Frontend', color: 'from-blue-500 to-indigo-600' },
    { name: 'PostgreSQL', icon: '🐘', category: 'Database', color: 'from-blue-400 to-indigo-400' },
    { name: 'Docker', icon: '🐳', category: 'DevOps', color: 'from-blue-500 to-cyan-500' },
    { name: 'GraphQL', icon: '📊', category: 'Backend', color: 'from-pink-500 to-purple-600' }
];

export const Project_Process = [
    { step: 'Discovery & Strategy', detail: 'We analyze your goals, audience, and competitors.', icon: <FaLightbulb className="text-2xl" />, duration: '1-2 weeks', deliverables: ['Project Plan', 'Wireframes'] },
    { step: 'UI/UX Design', detail: 'We craft pixel-perfect layouts to maximize engagement.', icon: <FaPaintBrush className="text-2xl" />, duration: '2-3 weeks', deliverables: ['Mockups', 'Prototypes'] },
    { step: 'Development', detail: 'Using modern stacks, we turn designs into functional apps.', icon: <FaCode className="text-2xl" />, duration: '4-8 weeks', deliverables: ['Frontend', 'Backend'] },
    { step: 'Testing & QA', detail: 'Tested for performance, security, and responsiveness.', icon: <FaCheckCircle className="text-2xl" />, duration: '1-2 weeks', deliverables: ['Bug Reports', 'Audit'] },
    { step: 'Launch & Support', detail: 'We deploy and maintain your site for long-term success.', icon: <FaRocket className="text-2xl" />, duration: 'Ongoing', deliverables: ['Live Site', 'Support'] }
];

export const Short_Services = [
    { title: "Custom Platforms", code: "SaaS / Web" },
    { title: "Enterprise Apps", code: "Architecture" },
    { title: "UI / UX Design", code: "Visual" },
    { title: "API Systems", code: "Backend" },
    { title: "Scale & Support", code: "DevOps" },
];

export const ServiceCategories = [
    { id: "all", label: "All Services", count: 16 },
    { id: "development", label: "Development", count: 8 },
    { id: "design", label: "UI/UX Design", count: 4 },
    { id: "optimization", label: "Optimization", count: 4 }
];
