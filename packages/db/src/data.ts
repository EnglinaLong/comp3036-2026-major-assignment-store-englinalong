export type Product = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  tags: string;
  active: boolean;
  price: number;
  stockQuantity: number;
  supportingText: string;
};

// Temporary compatibility alias while the rest of the app still imports `Post`.
export type Post = Product;

export const products: Product[] = [
  {
    id: 1,
    title: "Backend Starter Toolkit",
    urlId: "backend-starter-toolkit",
    description:
      "A backend-focused starter toolkit with API structure, auth patterns, database wiring, and deployment notes for modern full-stack teams.",
    content: `
# Backend Starter Toolkit

Ship backend features faster with a store-ready toolkit designed for practical Node.js delivery.

## What You Get

- Authentication and session architecture guidance
- Reusable service, route, and validation patterns
- Database-ready project structure for growing apps
- Environment, deployment, and release notes

## Ideal For

Developers building customer apps, internal tools, and admin systems who want a reliable backend foundation.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("Apr 18, 2026"),
    category: "Node",
    tags: "Back-End, APIs, Databases",
    views: 128,
    active: true,
    price: 87,
    stockQuantity: 20,
    supportingText:
      "Includes starter architecture notes, setup guidance, and reusable backend patterns.",
  },
  {
    id: 2,
    title: "React Storefront UI Kit",
    urlId: "react-storefront-ui-kit",
    description:
      "A polished React storefront kit with reusable product sections, responsive merchandising layouts, and customer-focused UI building blocks.",
    content: `
# React Storefront UI Kit

Build cleaner product pages and storefront layouts with a reusable React-first component pack.

## What You Get

- Responsive hero, feature, and product grid sections
- Reusable CTA, badge, and promo block patterns
- Store-ready spacing, layout, and merchandising guidance
- Frontend structure notes for scaling product pages

## Ideal For

Frontend teams who want a faster path to polished shopping and showcase experiences.
`,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661342428515-5ca8cee4385a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: new Date("Mar 16, 2026"),
    category: "React",
    tags: "Front-End, UI Kit, Storefront",
    views: 94,
    active: true,
    price: 84,
    stockQuantity: 20,
    supportingText:
      "Designed for storefront landing pages, product grids, and responsive product detail flows.",
  },
  {
    id: 3,
    title: "Frontend Performance Toolkit",
    urlId: "frontend-performance-toolkit",
    description:
      "A performance-focused frontend resource with practical optimization checklists, rendering advice, and scalable UI architecture patterns.",
    content: `
# Frontend Performance Toolkit

Improve perceived speed and maintainable frontend architecture with a toolkit built around practical performance wins.

## What You Get

- Performance review checklist for UI-heavy projects
- Asset, image, and rendering optimization notes
- Component structure patterns for scaling interfaces
- Guidance for balancing flexibility and bundle size

## Ideal For

Product teams improving storefront performance, discoverability, and rendering efficiency.
`,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661517706036-a48d5fc8f2f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    date: new Date("May 15, 2026"),
    category: "React",
    tags: "Front-End, Optimisation, Dev Tools",
    views: 76,
    active: true,
    price: 74,
    stockQuantity: 20,
    supportingText:
      "Built to help product teams ship faster pages without sacrificing maintainability.",
  },
  {
    id: 4,
    title: "Docker Deployment Toolkit",
    urlId: "docker-deployment-toolkit",
    description:
      "A deployment toolkit for containerised full-stack apps with Docker workflows, environment setup patterns, and release-ready delivery notes.",
    content: `
# Docker Deployment Toolkit

Move from local development to reliable deployments with a toolkit built for container-first workflows.

## What You Get

- Docker Compose workflow guidance
- Environment configuration patterns
- Deployment checklist for staging and production
- Practical notes for full-stack app release readiness

## Ideal For

Engineers packaging Node.js, React, and database-backed projects for smoother handoff and deployment.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80",
    date: new Date("May 14, 2026"),
    category: "DevOps",
    tags: "Docker, Deployment, Back-End",
    views: 61,
    active: true,
    price: 72,
    stockQuantity: 20,
    supportingText:
      "Includes release checklists, environment patterns, and container workflow notes.",
  },
  {
    id: 5,
    title: "Next.js Ecommerce Starter",
    urlId: "nextjs-ecommerce-starter",
    description:
      "A full-stack Next.js starter built for ecommerce demos, with product routes, scalable app structure, and conversion-focused page patterns.",
    content: `
# Next.js Ecommerce Starter

Kick off ecommerce builds with a modern Next.js structure tailored for product catalogs and customer journeys.

## What You Get

- Product listing and detail page patterns
- App Router-ready folder structure
- SEO-friendly content layout ideas
- Reusable storefront section guidance

## Ideal For

Teams building product-led demos, ecommerce MVPs, and scalable storefront prototypes with Next.js.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Feb 28, 2026"),
    category: "Next.js",
    tags: "Ecommerce, Front-End, Storefront",
    views: 143,
    active: true,
    price: 104,
    stockQuantity: 20,
    supportingText:
      "A strong base for product catalogs, landing pages, and conversion-focused storefront routes.",
  },
  {
    id: 6,
    title: "UI Component Library Pro",
    urlId: "ui-component-library-pro",
    description:
      "A reusable UI component library for product teams needing polished cards, pricing sections, navigation patterns, and clean interface building blocks.",
    content: `
# UI Component Library Pro

Speed up interface work with a reusable component collection built for real product screens.

## What You Get

- Pricing, feature, and testimonial patterns
- Navigation and content layout building blocks
- Reusable badges, cards, and CTA styles
- Design consistency notes for scalable teams

## Ideal For

Frontend teams standardising shared UI across customer dashboards and storefronts.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Jan 22, 2026"),
    category: "UI Design",
    tags: "UI Design, Components, Front-End",
    views: 102,
    active: true,
    price: 67,
    stockQuantity: 20,
    supportingText:
      "A reusable kit for teams building consistent customer and admin interfaces.",
  },
  {
    id: 7,
    title: "Cloud Deployment Starter Pack",
    urlId: "cloud-deployment-starter-pack",
    description:
      "A deployment-ready cloud resource pack covering hosting environments, release checklists, environment variables, and practical handoff notes.",
    content: `
# Cloud Deployment Starter Pack

Simplify cloud delivery with practical deployment checklists and environment planning notes.

## What You Get

- Release checklist for staging and production
- Environment variable and config planning guidance
- Team handoff notes for deployment ownership
- Cloud hosting workflow references

## Ideal For

Small teams preparing full-stack apps for dependable cloud launches.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    date: new Date("May 4, 2026"),
    category: "DevOps",
    tags: "Cloud, Deployment, DevOps",
    views: 88,
    active: true,
    price: 72,
    stockQuantity: 20,
    supportingText:
      "Practical for staging, production, and infrastructure handoff workflows.",
  },
  {
    id: 8,
    title: "API Security Toolkit",
    urlId: "api-security-toolkit",
    description:
      "A practical security toolkit for backend developers covering authentication flows, request validation, hardening checklists, and safer release habits.",
    content: `
# API Security Toolkit

Strengthen backend foundations with a practical resource focused on safer API delivery.

## What You Get

- Authentication and authorization planning notes
- Request validation patterns
- API hardening checklist
- Common release-time security checks

## Ideal For

Backend teams improving baseline API security for customer-facing products.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Mar 11, 2026"),
    category: "Node",
    tags: "APIs, Security, Back-End",
    views: 119,
    active: true,
    price: 92,
    stockQuantity: 20,
    supportingText:
      "Focused on secure defaults, safer request handling, and release-time checks.",
  },
  {
    id: 9,
    title: "SaaS Dashboard Kit",
    urlId: "saas-dashboard-kit",
    description:
      "A dashboard kit for SaaS products with account views, metrics cards, settings layouts, and reusable interface patterns for internal or customer tools.",
    content: `
# SaaS Dashboard Kit

Build polished SaaS dashboards with reusable layouts focused on clarity and product metrics.

## What You Get

- Metrics cards and overview layouts
- Account, settings, and usage page patterns
- Reusable dashboard UI building blocks
- Responsive structure guidance for web apps

## Ideal For

Teams building customer dashboards, admin portals, and internal product tools.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Apr 2, 2026"),
    category: "React",
    tags: "Dashboard, SaaS, Front-End",
    views: 131,
    active: true,
    price: 74,
    stockQuantity: 20,
    supportingText:
      "Useful for account screens, metrics views, and scalable product dashboards.",
  },
  {
    id: 10,
    title: "Ecommerce Analytics Dashboard",
    urlId: "ecommerce-analytics-dashboard",
    description:
      "A storefront analytics dashboard resource with product metrics, revenue summaries, and reporting UI patterns for ecommerce teams.",
    content: `
# Ecommerce Analytics Dashboard

Turn storefront metrics into cleaner reporting experiences with a dashboard built for product and commerce teams.

## What You Get

- Revenue and conversion summary sections
- Product performance dashboard layouts
- Analytics-focused UI patterns
- Clear information hierarchy for reporting screens

## Ideal For

Teams shipping internal commerce analytics tools or client-ready reporting interfaces.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    date: new Date("May 8, 2026"),
    category: "Analytics",
    tags: "Analytics, Ecommerce, Dashboard",
    views: 110,
    active: true,
    price: 74,
    stockQuantity: 20,
    supportingText:
      "Built for teams who need clearer product, conversion, and revenue reporting screens.",
  },
  {
    id: 11,
    title: "Responsive Admin Template",
    urlId: "responsive-admin-template",
    description:
      "A responsive admin template with management screens, navigation layouts, table patterns, and mobile-friendly structure for operations teams.",
    content: `
# Responsive Admin Template

Create cleaner operations screens with an admin template designed for flexibility across desktop and mobile.

## What You Get

- Table and management screen layouts
- Responsive sidebar and header patterns
- Admin form and filter UI ideas
- Mobile-friendly layout guidance

## Ideal For

Teams building internal tools, product operations panels, and admin prototypes.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Jan 23, 2026"),
    category: "Responsive Design",
    tags: "Admin, Responsive Design, UI Design",
    views: 72,
    active: true,
    price: 77,
    stockQuantity: 20,
    supportingText:
      "Includes patterns for dashboards, management screens, and mobile-friendly admin workflows.",
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

## What You Get

- Product card and collection filter patterns
- Detail page content sections
- CTA and merchandising components
- Reusable storefront interaction patterns

## Ideal For

Frontend teams shipping customer-facing product grids and detail pages with React.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Apr 1, 2026"),
    category: "React",
    tags: "React, Ecommerce, Components",
    views: 97,
    active: true,
    price: 74,
    stockQuantity: 20,
    supportingText:
      "Made for teams building reusable product cards, filters, and merchandising sections.",
  },
  {
    id: 13,
    title: "Tailwind UI Component Pack",
    urlId: "tailwind-ui-component-pack",
    description:
      "A Tailwind-first component pack with storefront sections, dashboard blocks, and reusable interface patterns for product teams.",
    content: `
# Tailwind UI Component Pack

Design and ship product interfaces faster with a component pack built around practical Tailwind patterns.

## What You Get

- Storefront hero, pricing, and feature sections
- Dashboard cards and layout building blocks
- Reusable utility-first component patterns
- Guidance for keeping product UIs consistent at scale

## Ideal For

Teams building customer storefronts, admin dashboards, and internal product experiences with Tailwind CSS.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    date: new Date("May 9, 2026"),
    category: "UI Design",
    tags: "Tailwind, Components, Front-End",
    views: 84,
    active: true,
    price: 72,
    stockQuantity: 20,
    supportingText:
      "Useful for product teams standardising utility-first UI across storefront and admin work.",
  },
  {
    id: 14,
    title: "Node API Builder Pack",
    urlId: "node-api-builder-pack",
    description:
      "A Node.js resource pack for structuring services, requests, validation, and backend modules in a way that scales beyond quick prototypes.",
    content: `
# Node API Builder Pack

Build backend services with more confidence using a pack focused on practical Node API structure.

## What You Get

- Service and module organization patterns
- Validation and error-handling guidance
- Request lifecycle structure ideas
- Clean backend scaling notes

## Ideal For

Engineers growing APIs from prototypes into maintainable full-stack products.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
    date: new Date("Jan 24, 2026"),
    category: "Node",
    tags: "Node, APIs, Back-End",
    views: 117,
    active: true,
    price: 92,
    stockQuantity: 20,
    supportingText:
      "A practical fit for backend teams scaling service structure, validation, and request flows.",
  },
  {
    id: 15,
    title: "Mobile Responsive Design Pack",
    urlId: "mobile-responsive-design-pack",
    description:
      "A responsive design pack with mobile-first layout guidance, reusable interface patterns, and practical UI references for modern product teams.",
    content: `
# Mobile Responsive Design Pack

Create more reliable mobile shopping and product experiences with a design pack focused on clarity, flexibility, and responsive structure.

## What You Get

- Mobile-first layout references
- Responsive spacing and card pattern ideas
- Practical UI guidance for smaller screens
- Storefront-friendly interaction notes

## Ideal For

Teams polishing responsive customer journeys across landing pages, product grids, and detail screens.
`,
    imageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    date: new Date("May 10, 2026"),
    category: "Responsive Design",
    tags: "Mobile, Front-End, UI Design",
    views: 0,
    active: true,
    price: 67,
    stockQuantity: 20,
    supportingText:
      "Helpful for teams refining mobile-first product pages and responsive customer flows.",
  },
];

// Temporary compatibility alias while older code still refers to `posts`.
export const posts = products;

const seededProductsById = new Map(products.map((product) => [product.id, product]));
const seededProductsByUrlId = new Map(
  products.map((product) => [product.urlId, product]),
);

export function getSeededProduct(product: Pick<Product, "id" | "urlId">) {
  return (
    seededProductsById.get(product.id) ??
    seededProductsByUrlId.get(product.urlId)
  );
}

export function getSeededProductDate(product: Pick<Product, "id" | "urlId">) {
  return getSeededProduct(product)?.date;
}

// Temporary compatibility exports while the app still uses legacy helper names.
export function getSeededPost(post: Pick<Post, "id" | "urlId">) {
  return getSeededProduct(post);
}

export function getSeededPostDate(post: Pick<Post, "id" | "urlId">) {
  return getSeededProductDate(post);
}
