export type Post = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  likes: number;
  tags: string;
  active: boolean;
};

export const posts: Post[] = [
  {
    id: 1,
    title: "Backend Starter Toolkit",
    urlId: "backend-starter-toolkit",
    description:
      "A backend-focused starter toolkit for shipping scalable Node.js services faster with auth patterns, reusable API structure, and production-ready setup guidance.",
    content: `
  # Backend Starter Toolkit

  Launch full-stack products faster with a backend starter designed for modern Node.js applications.

  ## What's Included

  - Authentication and session architecture guidance
  - Reusable service and route structure
  - Database-ready project organization patterns
  - Deployment and environment configuration notes

  ## Best For Developers

  Teams building APIs, dashboards, and internal tools who want a practical backend foundation without starting from scratch.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("Apr 18, 2026"),
    category: "Node",
    tags: "Back-End, APIs, Databases",
    views: 128,
    likes: 18,
    active: true,
  },
  {
    id: 2,
    title: "React Storefront UI Kit",
    urlId: "react-storefront-ui-kit",
    description:
      "A polished React UI kit with reusable storefront sections, responsive layouts, and production-style components for modern ecommerce and product experiences.",
    content: `
  # React Storefront UI Kit

  Build cleaner product pages and storefront landing sections with a reusable React-first component set.

  ## What's Included

  - Responsive hero, feature, and product grid sections
  - Reusable CTA and badge patterns
  - Store-ready component spacing and hierarchy
  - Frontend structure notes for scaling product pages

  ## Best For Developers

  Frontend teams who want a faster path to polished shopping and showcase interfaces using React.
`,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661342428515-5ca8cee4385a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: new Date("Mar 16, 2026"),
    category: "React",
    tags: "Front-End, UI Kit, Storefront",
    views: 94,
    likes: 12,
    active: true,
  },
  {
    id: 3,
    title: "Frontend Performance Toolkit",
    urlId: "frontend-performance-toolkit",
    description:
      "A lightweight performance resource focused on fast-loading frontends, scalable component architecture, and practical optimization patterns for modern web apps.",
    content: `
  # Frontend Performance Toolkit

  Improve perceived speed and maintainable frontend architecture with a toolkit built around practical optimization wins.

  ## What's Included

  - Performance review checklist for UI-heavy projects
  - Asset, image, and rendering optimization notes
  - Component structure patterns for scaling interfaces
  - Guidance for balancing flexibility and bundle size

  ## Best For Developers

  Product teams improving storefront performance, discoverability, and rendering efficiency.
`,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661517706036-a48d5fc8f2f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    date: new Date("May 15, 2026"),
    category: "React",
    tags: "Front-End, Optimisation, Dev Tools",
    views: 76,
    likes: 9,
    active: true,
  },
  {
    id: 4,
    title: "Docker Deployment Toolkit",
    urlId: "docker-deployment-toolkit",
    description:
      "A deployment toolkit for containerised full-stack projects, including Docker workflow guidance, environment setup patterns, and release-ready delivery notes.",
    content: `
  # Docker Deployment Toolkit

  Move from local development to reliable deployments with a toolkit built for container-first workflows.

  ## What's Included

  - Docker compose workflow guidance
  - Environment configuration patterns
  - Deployment checklist for staging and production
  - Practical notes for full-stack app release readiness

  ## Best For Developers

  Engineers packaging Node.js, React, and database-backed projects for smoother handoff and deployment.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80",
    date: new Date("May 14, 2026"),
    category: "DevOps",
    tags: "Docker, Deployment, Back-End",
    views: 61,
    likes: 7,
    active: true,
  },
  {
    id: 5,
    title: "Next.js Ecommerce Starter",
    urlId: "nextjs-ecommerce-starter",
    description:
      "A full-stack Next.js starter built for ecommerce demos, with storefront structure, product-detail patterns, and scalable app routing ready for extension.",
    content: `
  # Next.js Ecommerce Starter

  Kick off ecommerce builds with a modern Next.js structure tailored for product catalogs and conversion-focused flows.

  ## What's Included

  - Product listing and detail page patterns
  - App Router-ready folder structure
  - SEO-friendly content layout ideas
  - Reusable storefront section guidance

  ## Best For Developers

  Teams building product-led demos, ecommerce MVPs, and scalable storefront prototypes with Next.js.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Feb 28, 2026"),
    category: "Next.js",
    tags: "Ecommerce, Front-End, Storefront",
    views: 143,
    likes: 24,
    active: true,
  },
  {
    id: 6,
    title: "UI Component Library Pro",
    urlId: "ui-component-library-pro",
    description:
      "A curated UI component library for product teams that need reusable cards, pricing sections, navigation patterns, and clean interface building blocks.",
    content: `
  # UI Component Library Pro

  Speed up interface work with a reusable component collection built for real product screens.

  ## What's Included

  - Pricing, feature, and testimonial patterns
  - Navigation and content layout building blocks
  - Reusable badges, cards, and CTA styles
  - Design consistency notes for scalable teams

  ## Best For Developers

  Frontend teams standardising shared UI across customer dashboards and storefronts.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Jan 22, 2026"),
    category: "UI Design",
    tags: "UI Design, Components, Front-End",
    views: 102,
    likes: 14,
    active: true,
  },
  {
    id: 7,
    title: "Cloud Deployment Starter Pack",
    urlId: "cloud-deployment-starter-pack",
    description:
      "A deployment-ready DevOps resource pack covering cloud environments, release checklists, environment variables, and practical team handoff notes.",
    content: `
  # Cloud Deployment Starter Pack

  Simplify cloud delivery with practical deployment checklists and environment planning notes.

  ## What's Included

  - Release checklist for staging and production
  - Environment variable and config planning guidance
  - Team handoff notes for deployment ownership
  - Cloud hosting workflow references

  ## Best For Developers

  Small teams preparing full-stack apps for dependable cloud launches.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    date: new Date("May 4, 2026"),
    category: "DevOps",
    tags: "Cloud, Deployment, DevOps",
    views: 88,
    likes: 11,
    active: true,
  },
  {
    id: 8,
    title: "API Security Toolkit",
    urlId: "api-security-toolkit",
    description:
      "A practical security toolkit for backend developers covering authentication flows, request validation patterns, API hardening checklists, and safer release habits.",
    content: `
  # API Security Toolkit

  Strengthen backend foundations with a practical resource focused on safer API delivery.

  ## What's Included

  - Authentication and authorization planning notes
  - Request validation patterns
  - API hardening checklist
  - Common release-time security checks

  ## Best For Developers

  Backend teams improving baseline API security for customer-facing products.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Mar 11, 2026"),
    category: "Node",
    tags: "APIs, Security, Back-End",
    views: 119,
    likes: 19,
    active: true,
  },
  {
    id: 9,
    title: "SaaS Dashboard Kit",
    urlId: "saas-dashboard-kit",
    description:
      "A dashboard kit for SaaS products featuring account views, metrics cards, settings layouts, and reusable UI patterns for fast internal or customer tools.",
    content: `
  # SaaS Dashboard Kit

  Build polished SaaS dashboards with reusable layouts focused on clarity and product metrics.

  ## What's Included

  - Metrics cards and overview layouts
  - Account, settings, and usage page patterns
  - Reusable dashboard UI building blocks
  - Responsive structure guidance for web apps

  ## Best For Developers

  Teams building customer dashboards, admin portals, and internal product tools.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Apr 2, 2026"),
    category: "React",
    tags: "Dashboard, SaaS, Front-End",
    views: 131,
    likes: 27,
    active: true,
  },
  {
    id: 10,
    title: "Ecommerce Analytics Dashboard",
    urlId: "ecommerce-analytics-dashboard",
    description:
      "A storefront analytics dashboard resource with product-metrics views, revenue summary layouts, and modern reporting UI patterns for ecommerce teams.",
    content: `
  # Ecommerce Analytics Dashboard

  Turn storefront metrics into cleaner reporting experiences with a dashboard built for product and commerce teams.

  ## What's Included

  - Revenue and conversion summary sections
  - Product performance dashboard layouts
  - Analytics-focused UI patterns
  - Clear information hierarchy for reporting screens

  ## Best For Developers

  Teams shipping internal commerce analytics tools or client-ready reporting interfaces.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    date: new Date("May 8, 2026"),
    category: "React",
    tags: "Analytics, Ecommerce, Dashboard",
    views: 110,
    likes: 16,
    active: true,
  },
  {
    id: 11,
    title: "Responsive Admin Template",
    urlId: "responsive-admin-template",
    description:
      "A responsive admin template with management screens, navigation layouts, table patterns, and mobile-friendly interface structure for operations teams.",
    content: `
  # Responsive Admin Template

  Create cleaner operations screens with an admin template designed for flexibility across desktop and mobile.

  ## What's Included

  - Table and management screen layouts
  - Responsive sidebar and header patterns
  - Admin form and filter UI ideas
  - Mobile-friendly layout guidance

  ## Best For Developers

  Teams building internal tools, product operations panels, and admin prototypes.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Jan 23, 2026"),
    category: "Responsive Design",
    tags: "Admin, Responsive Design, UI Design",
    views: 72,
    likes: 8,
    active: true,
  },
  {
    id: 12,
    title: "React Ecommerce Components",
    urlId: "react-ecommerce-components",
    description:
      "A focused pack of ecommerce-ready React components including product cards, collection filters, CTA sections, and detail-page content blocks.",
    content: `
  # React Ecommerce Components

  Assemble product experiences faster with a focused React component pack made for ecommerce layouts.

  ## What's Included

  - Product card and collection filter patterns
  - Detail page content sections
  - CTA and merchandising components
  - Reusable storefront interaction patterns

  ## Best For Developers

  Frontend teams shipping customer-facing product grids and detail pages with React.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Apr 1, 2026"),
    category: "React",
    tags: "React, Ecommerce, Components",
    views: 97,
    likes: 13,
    active: true,
  },
  {
    id: 13,
    title: "Modern UI Design System",
    urlId: "modern-ui-design-system",
    description:
      "A modern design system resource for digital products with typography rules, color decisions, reusable component structure, and scalable interface guidance.",
    content: `
  # Modern UI Design System

  Build stronger visual consistency with a design system focused on reusable product UI.

  ## What's Included

  - Typography and spacing guidance
  - Reusable color and component decisions
  - Scalable interface planning notes
  - Practical system-building references

  ## Best For Developers

  Product teams aligning developers and designers around a shared interface language.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    date: new Date("May 9, 2026"),
    category: "UI Design",
    tags: "Design System, UI Design, Front-End",
    views: 84,
    likes: 10,
    active: true,
  },
  {
    id: 14,
    title: "Node API Builder Pack",
    urlId: "node-api-builder-pack",
    description:
      "A Node.js resource pack for structuring services, requests, validation, and backend module patterns in a way that scales beyond quick prototypes.",
    content: `
  # Node API Builder Pack

  Build backend services with more confidence using a pack focused on practical Node API structure.

  ## What's Included

  - Service and module organization patterns
  - Validation and error-handling guidance
  - Request lifecycle structure ideas
  - Clean backend scaling notes

  ## Best For Developers

  Engineers growing APIs from prototypes into maintainable full-stack products.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Jan 24, 2026"),
    category: "Node",
    tags: "Node, APIs, Back-End",
    views: 117,
    likes: 20,
    active: true,
  },
  {
    id: 15,
    title: "Mobile Responsive Design Pack",
    urlId: "mobile-responsive-design-pack",
    description:
      "A responsive design resource pack with mobile-first layout guidance, reusable interface patterns, and practical UI references for modern product teams.",
    content: `
  # Mobile Responsive Design Pack

  Create more reliable mobile shopping and product experiences with a design pack focused on clarity, flexibility, and responsive structure.

  ## What's Included

  - Mobile-first layout references
  - Responsive spacing and card pattern ideas
  - Practical UI guidance for smaller screens
  - Storefront-friendly interaction notes

  ## Best For Developers

  Teams polishing responsive customer journeys across landing pages, product grids, and detail screens.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    date: new Date("May 10, 2026"),
    category: "Responsive Design",
    tags: "Mobile, Front-End, UI Design",
    views: 0,
    likes: 0,
    active: true,
  },
];

const seededPostsById = new Map(posts.map((post) => [post.id, post]));
const seededPostsByUrlId = new Map(posts.map((post) => [post.urlId, post]));

export function getSeededPost(post: Pick<Post, "id" | "urlId">) {
  return seededPostsById.get(post.id) ?? seededPostsByUrlId.get(post.urlId);
}

export function getSeededPostDate(post: Pick<Post, "id" | "urlId">) {
  return getSeededPost(post)?.date;
}
