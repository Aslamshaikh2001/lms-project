import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  CirclePlay,
  ClipboardCheck,
  GraduationCap,
  Menu,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  BarChart3,
  Layers3,
  Zap,
  Code2,
  Award,
  Building2,
  MessageCircle,
} from "lucide-react";

import logo from "../assets/images/s-logo.png";
import "../styles/Home.css";

const features = [
  {
    icon: BookOpen,
    number: "01",
    title: "Structured Learning",
    description:
      "Discover learning content and follow an organized learning journey.",
    tag: "Learn",
    color: "yellow",
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Assessments & Exams",
    description:
      "Manage assessments, assignments, and structured evaluations.",
    tag: "Evaluate",
    color: "blue",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Progress & Results",
    description:
      "Review assessment results and understand learning progress.",
    tag: "Measure",
    color: "purple",
  },
  {
    icon: Users,
    number: "04",
    title: "Student Management",
    description:
      "Organize student information and access relevant records.",
    tag: "Organize",
    color: "green",
  },
  {
    icon: GraduationCap,
    number: "05",
    title: "Instructor Workspace",
    description:
      "Give instructors a dedicated space for their teaching activities.",
    tag: "Teach",
    color: "pink",
  },
  {
    icon: ShieldCheck,
    number: "06",
    title: "Role-Based Access",
    description:
      "Provide suitable workspaces for students, instructors, and admins.",
    tag: "Manage",
    color: "orange",
  },
];

const courses = [
  {
    title: "Java Full Stack Development",
    category: "FULL STACK",
    icon: Code2,
    description:
      "Learn to build complete web applications with Java, backend services, and modern frontend tools.",
    topics: ["Core Java", "Spring Boot", "React.js", "MySQL"],
    color: "java",
  },
  {
    title: "Frontend Development",
    category: "WEB DEVELOPMENT",
    icon: MonitorPlay,
    description:
      "Create responsive, interactive websites and engaging user interfaces.",
    topics: ["HTML", "CSS", "JavaScript", "React.js"],
    color: "frontend",
  },
  {
    title: "Backend Development",
    category: "SERVER SIDE",
    icon: Layers3,
    description:
      "Build APIs, manage server-side logic, and connect applications to databases.",
    topics: ["Node.js", "Express.js", "REST APIs", "MongoDB"],
    color: "backend",
  },
  {
    title: "Java Programming",
    category: "PROGRAMMING",
    icon: Code2,
    description:
      "Develop strong programming fundamentals and prepare for coding interviews.",
    topics: ["Core Java", "OOP", "Collections", "DSA"],
    color: "programming",
  },
  {
    title: "UI/UX Design",
    category: "DESIGN",
    icon: Layers3,
    description:
      "Learn interface design and create intuitive digital experiences.",
    topics: ["UI Design", "UX Research", "Figma", "Prototypes"],
    color: "design",
  },
  {
    title: "Data Science & AI",
    category: "EMERGING TECHNOLOGY",
    icon: BrainCircuit,
    description:
      "Explore data analysis, machine learning fundamentals, and AI applications.",
    topics: ["Python", "Data Analysis", "Machine Learning", "AI"],
    color: "data",
  },
];

const audiences = [
  {
    icon: GraduationCap,
    title: "For Students",
    text: "Access your learning workspace, take assessments, and review results.",
    points: [
      "Student dashboard",
      "Assessment access",
      "Results and progress",
    ],
  },
  {
    icon: MonitorPlay,
    title: "For Instructors",
    text: "Use a dedicated workspace to support teaching and learning.",
    points: [
      "Instructor dashboard",
      "Teaching workspace",
      "Organized access",
    ],
  },
  {
    icon: Building2,
    title: "For Institutions",
    text: "Bring student administration and assessment management together.",
    points: [
      "Student management",
      "Assessment administration",
      "Role-based access",
    ],
  },
];

const steps = [
  {
    number: "01",
    icon: Users,
    title: "Access your workspace",
    text: "Sign in or create an account to get started.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Learn and participate",
    text: "Use the learning and assessment features available to your role.",
  },
  {
    number: "03",
    icon: Target,
    title: "Review your progress",
    text: "Access relevant results and learning information.",
  },
];

const learningTopics = [
  {
    icon: Code2,
    title: "Programming",
    text: "Build technical knowledge and coding skills.",
  },
  {
    icon: BrainCircuit,
    title: "Skill Development",
    text: "Support continuous learning and improvement.",
  },
  {
    icon: ClipboardCheck,
    title: "Assessments",
    text: "Practice and evaluate what you have learned.",
  },
  {
    icon: Layers3,
    title: "Learning Resources",
    text: "Keep learning activities organized in one place.",
  },
];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <div
      className={`home-reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ kicker, title, highlight, description }) {
  return (
    <Reveal className="home-section-heading">
      <span className="home-section-kicker">{kicker}</span>
      <h2>
        {title}
        <br />
        <span>{highlight}</span>
      </h2>
      <p>{description}</p>
    </Reveal>
  );
}

function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`home-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="home-header-inner">
        <Link
          to="/"
          className="home-brand"
          aria-label="SVR-EDTECH home"
          onClick={closeMenu}
        >
          <img src={logo} alt="SVR-EDTECH logo" className="home-brand-logo" />
          <span className="home-brand-copy">
            <strong>
              SVR<span>EDTECH</span>
            </strong>
            <small>LEARN. GROW. ACHIEVE.</small>
          </span>
        </Link>

        <button
          className="home-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        <nav className={`home-nav ${menuOpen ? "home-nav-open" : ""}`}>
          <a href="#features" onClick={closeMenu}>Features</a>
          <a href="#courses" onClick={closeMenu}>Courses</a>
          <a href="#learning" onClick={closeMenu}>Learning</a>
          <a href="#audience" onClick={closeMenu}>Who it's for</a>
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>

          <div className="home-nav-actions">
            <Link to="/login" className="home-login-link" onClick={closeMenu}>
              Log in
            </Link>
            <Link to="/register" className="home-nav-cta" onClick={closeMenu}>
              Register <ArrowUpRight size={16} />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="Digital learning dashboard illustration">
      <div className="hero-orbit hero-orbit-one" />
      <div className="hero-orbit hero-orbit-two" />
      <div className="hero-float hero-float-spark"><Sparkles size={22} /></div>
      <div className="hero-float hero-float-zap"><Zap size={21} /></div>

      <div className="hero-dashboard">
        <div className="hero-dashboard-top">
          <div className="hero-window-dots"><i /><i /><i /></div>
          <span>MY LEARNING SPACE</span>
          <div className="hero-live-dot" />
        </div>

        <div className="hero-dashboard-body">
          <div className="hero-welcome">
            <div>
              <span className="hero-mini-label">YOUR NEXT CHAPTER</span>
              <h3>Keep moving<br />forward<span>.</span></h3>
            </div>
            <div className="hero-avatar"><GraduationCap size={25} /></div>
          </div>

          <div className="hero-progress-card">
            <div className="hero-progress-icon"><BookOpen size={20} /></div>
            <div className="hero-progress-copy">
              <strong>Learning journey</strong>
              <span>Make progress, one step at a time</span>
              <div className="hero-progress-track"><span /></div>
            </div>
            <ArrowUpRight size={18} className="hero-progress-arrow" />
          </div>

          <div className="hero-dashboard-grid">
            <div className="hero-mini-card">
              <div className="hero-mini-card-icon hero-mini-yellow">
                <ClipboardCheck size={19} />
              </div>
              <strong>Assessments</strong>
              <span>Test your knowledge</span>
            </div>
            <div className="hero-mini-card">
              <div className="hero-mini-card-icon hero-mini-teal">
                <BarChart3 size={19} />
              </div>
              <strong>Results</strong>
              <span>Review your progress</span>
            </div>
          </div>

          <div className="hero-bottom-note">
            <span className="hero-bottom-check"><CheckCircle2 size={16} /></span>
            <span>Your learning journey, organized.</span>
          </div>
        </div>
      </div>

      <div className="hero-float hero-float-book"><BookOpen size={24} /></div>
      <div className="hero-float hero-float-award"><Award size={23} /></div>
    </div>
  );
}

function HomeHero() {
  return (
    <section className="home-hero">
      <div className="home-hero-glow home-hero-glow-one" />
      <div className="home-hero-glow home-hero-glow-two" />

      <div className="home-container home-hero-grid">
        <div className="home-hero-copy">
          <div className="home-eyebrow">
            <span className="home-eyebrow-icon"><Sparkles size={15} /></span>
            A smarter way to learn
            <span className="home-eyebrow-line" />
          </div>

          <h1>
            Make learning
            <br />
            <span className="hero-heading-highlight">work for you.</span>
          </h1>

          <p className="home-hero-description">
            Discover a more organized learning experience with SVR-EDTECH.
            Access learning tools, assessments, results, and role-based
            workspaces through one connected platform.
          </p>

          <div className="home-hero-actions">
            <Link to="/register" className="home-button home-button-primary">
              Get started <ArrowRight size={18} />
            </Link>
            <a href="#courses" className="home-button home-button-secondary">
              <CirclePlay size={19} /> Explore courses
            </a>
          </div>

          <div className="home-hero-trust">
            <div className="home-trust-icon"><ShieldCheck size={18} /></div>
            <div>
              <strong>One connected platform</strong>
              <span>Learning · Assessment · Administration</span>
            </div>
          </div>
        </div>

        <HeroVisual />
      </div>

      <div className="home-hero-bottom">
        <div className="home-container home-hero-bottom-inner">
          <span>DESIGNED AROUND THE LEARNING EXPERIENCE</span>
          <div className="hero-bottom-items">
            <span><BookOpen size={15} /> Learn</span>
            <span><ClipboardCheck size={15} /> Assess</span>
            <span><BarChart3 size={15} /> Improve</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeIntroStrip() {
  return (
    <section className="home-intro-strip">
      <div className="home-container home-intro-grid">
        <div className="home-intro-title">
          <span className="home-section-kicker">THE PLATFORM</span>
          <h2>More clarity.<br /><span>More possibilities.</span></h2>
        </div>
        <p>
          Learning involves more than opening a course. It takes organization,
          evaluation, feedback, and the right tools for each person. SVR-EDTECH
          brings key learning and management features into one structured
          digital experience.
        </p>
        <a href="#features" className="home-text-link">
          Discover the features <ArrowRight size={17} />
        </a>
      </div>
    </section>
  );
}

function HomeFeatures() {
  return (
    <section className="home-section home-features-section" id="features">
      <div className="home-container">
        <SectionHeading
          kicker="BUILT FOR LEARNING"
          title="Everything you need to"
          highlight="move forward."
          description="Practical tools that bring learning activities, assessments, student information, and platform access together."
        />

        <div className="home-feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.number} delay={index * 60}>
                <article className={`home-feature-card feature-${feature.color}`}>
                  <div className="home-feature-card-top">
                    <div className="home-feature-icon"><Icon size={23} /></div>
                    <span className="home-feature-number">{feature.number}</span>
                  </div>
                  <span className="home-feature-tag">{feature.tag}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="home-feature-bottom">
                    <span>Explore capability</span>
                    <ArrowUpRight size={17} />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HomeCourses() {
  return (
    <section className="home-section home-courses-section" id="courses">
      <div className="home-container">
        <SectionHeading
          kicker="EXPLORE YOUR POTENTIAL"
          title="Find the skills to"
          highlight="move you forward."
          description="Explore learning paths designed to help you develop practical skills and grow your knowledge."
        />

        <div className="home-course-grid">
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <Reveal key={course.title} delay={index * 65}>
                <article className={`home-course-card course-${course.color}`}>
                  <div className="home-course-top">
                    <div className="home-course-icon"><Icon size={25} /></div>
                    <span className="home-course-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <span className="home-course-category">{course.category}</span>
                  <h3>{course.title}</h3>
                  <p className="home-course-description">{course.description}</p>

                  <div className="home-course-divider" />
                  <span className="home-course-topics-label">WHAT YOU'LL EXPLORE</span>

                  <div className="home-course-topics">
                    {course.topics.map((topic) => (
                      <span key={topic}>{topic}</span>
                    ))}
                  </div>

                  <Link to="/register" className="home-course-link">
                    Explore course <ArrowUpRight size={17} />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="home-courses-bottom">
          <span><BookOpen size={18} /> Keep learning. Keep growing.</span>
          <Link to="/register" className="home-courses-cta">
            Get started <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomeLearning() {
  return (
    <section className="home-section home-learning-section" id="learning">
      <div className="home-container home-learning-grid">
        <Reveal className="home-learning-copy">
          <span className="home-section-kicker">A BETTER LEARNING FLOW</span>
          <h2>Learning should feel<br /><span>clear, not complicated.</span></h2>
          <p>
            Bring your learning activities into a structured experience.
            Whether you are accessing assessments or checking learning
            information, the platform is designed around your role.
          </p>

          <ul className="home-check-list">
            <li><CheckCircle2 size={19} /> A dedicated workspace for each role</li>
            <li><CheckCircle2 size={19} /> Structured assessment experiences</li>
            <li><CheckCircle2 size={19} /> Access to relevant results and records</li>
            <li><CheckCircle2 size={19} /> A consistent experience across devices</li>
          </ul>

          <Link to="/register" className="home-button home-button-dark">
            Start your journey <ArrowRight size={18} />
          </Link>
        </Reveal>

        <Reveal className="home-learning-visual" delay={100}>
          <div className="learning-visual-top">
            <div>
              <span className="learning-visual-label">LEARNING TOOLKIT</span>
              <h3>Build your next skill.</h3>
            </div>
            <div className="learning-visual-badge"><Sparkles size={19} /></div>
          </div>

          <div className="learning-topic-list">
            {learningTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <div
                  className="learning-topic"
                  key={topic.title}
                  style={{ "--topic-delay": `${index * 80}ms` }}
                >
                  <div className={`learning-topic-icon topic-icon-${index}`}>
                    <Icon size={21} />
                  </div>
                  <div className="learning-topic-copy">
                    <strong>{topic.title}</strong>
                    <span>{topic.text}</span>
                  </div>
                  <ArrowUpRight size={17} className="learning-topic-arrow" />
                </div>
              );
            })}
          </div>

          <div className="learning-visual-footer">
            <div className="learning-footer-icon"><Zap size={17} /></div>
            <div>
              <strong>Keep building momentum</strong>
              <span>Every step counts.</span>
            </div>
            <div className="learning-footer-spark">✦</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HomeAudience() {
  return (
    <section className="home-section home-audience-section" id="audience">
      <div className="home-container">
        <SectionHeading
          kicker="ONE PLATFORM, DIFFERENT ROLES"
          title="Tools for the people"
          highlight="who make learning happen."
          description="Dedicated workspaces help each user focus on the tasks and information relevant to their role."
        />

        <div className="home-audience-grid">
          {audiences.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 80}>
                <article className={`home-audience-card audience-card-${index}`}>
                  <div className="home-audience-icon"><Icon size={27} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}><CheckCircle2 size={16} /> {point}</li>
                    ))}
                  </ul>
                  <div className="home-audience-number">0{index + 1}</div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HomeHowItWorks() {
  return (
    <section className="home-section home-steps-section" id="how-it-works">
      <div className="home-container">
        <SectionHeading
          kicker="GETTING STARTED"
          title="Your next step starts"
          highlight="right here."
          description="A simple overview of how to begin using the platform."
        />

        <div className="home-steps-grid">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.number} delay={index * 90}>
                <article className="home-step-card">
                  <div className="home-step-top">
                    <span className="home-step-number">{step.number}</span>
                    <div className="home-step-icon"><Icon size={23} /></div>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  {index !== steps.length - 1 && (
                    <div className="home-step-connector"><ArrowRight size={19} /></div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HomeCTA() {
  return (
    <section className="home-cta-section">
      <div className="home-container">
        <div className="home-cta-card">
          <div className="home-cta-decoration home-cta-decoration-one" />
          <div className="home-cta-decoration home-cta-decoration-two" />

          <div className="home-cta-content">
            <span className="home-cta-kicker">
              <Sparkles size={15} /> YOUR NEXT CHAPTER STARTS HERE
            </span>
            <h2>Ready to make<br />learning <span>count?</span></h2>
            <p>
              Take the next step with SVR-EDTECH and discover a more
              organized way to access your learning workspace.
            </p>
            <div className="home-cta-actions">
              <Link to="/register" className="home-button home-button-primary">
                Get started <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="home-cta-login">
                Already have an account? <strong>Log in</strong>
              </Link>
            </div>
          </div>

          <div className="home-cta-art" aria-hidden="true">
            <div className="cta-art-ring cta-art-ring-one" />
            <div className="cta-art-ring cta-art-ring-two" />
            <div className="cta-art-cap"><GraduationCap size={77} strokeWidth={1.4} /></div>
            <div className="cta-art-spark cta-art-spark-one">✦</div>
            <div className="cta-art-spark cta-art-spark-two">✧</div>
            <div className="cta-art-card">
              <CheckCircle2 size={18} />
              <span>One step at a time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-container">
        <div className="home-footer-main">
          <div className="home-footer-brand">
            <Link to="/" className="home-brand">
              <img src={logo} alt="SVR-EDTECH logo" className="home-brand-logo" />
              <span className="home-brand-copy">
                <strong>SVR<span>EDTECH</span></strong>
                <small>LEARN. GROW. ACHIEVE.</small>
              </span>
            </Link>
            <p>
              A connected digital experience for learning, assessments,
              student administration, and role-based workspaces.
            </p>
          </div>

          <div className="home-footer-column">
            <h4>Explore</h4>
            <a href="#features">Platform features</a>
            <a href="#courses">Courses</a>
            <a href="#learning">Learning experience</a>
            <a href="#audience">Who it's for</a>
            <a href="#how-it-works">How it works</a>
          </div>

          <div className="home-footer-column">
            <h4>Your account</h4>
            <Link to="/login">Log in</Link>
            <Link to="/register">Create account</Link>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <div className="home-footer-note">
            <div className="footer-note-icon"><MessageCircle size={20} /></div>
            <h4>Keep moving forward.</h4>
            <p>Start with the tools and workspace available to your role.</p>
            <Link to="/register">Get started <ArrowRight size={15} /></Link>
          </div>
        </div>

        <div className="home-footer-bottom">
          <span>© {new Date().getFullYear()} SVR-EDTECH. All rights reserved.</span>
          <span className="home-footer-tagline">One platform. New possibilities.</span>
          <a
            href="#top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  useEffect(() => {
    document.title = "SVR-EDTECH | Learn. Grow. Achieve.";

    const elements = document.querySelectorAll(".home-reveal");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="svr-home" id="top">
      <HomeHeader />
      <main>
        <HomeHero />
        <HomeIntroStrip />
        <HomeFeatures />
        <HomeCourses />
        <HomeLearning />
        <HomeAudience />
        <HomeHowItWorks />
        <HomeCTA />
      </main>
      <HomeFooter />
    </div>
  );
}