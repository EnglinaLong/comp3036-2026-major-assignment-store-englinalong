import type { Post } from "@repo/db/data";

const storefrontProductCopy: Record<
  string,
  Pick<Post, "title" | "description" | "content">
> = {
  "boost-your-conversion-rate": {
    title: "Backend Starter Toolkit",
    description:
      "A backend-focused starter toolkit designed to help developers build scalable full-stack applications faster. Includes reusable API structures, authentication setup patterns, and production-ready optimisation strategies.",
    content: `
# Product overview

Backend Starter Toolkit is a practical backend starter kit for developers shipping modern full-stack products. It combines clean Node.js service patterns, database-ready structure, and implementation notes that help teams move from prototype to production with less setup overhead.

Perfect for developers building modern Node.js and database-driven applications.

## What's included

- Reusable API folder templates
- Authentication and session setup patterns
- Database integration guidance
- Production-minded optimisation checklists

## Best for developers

Teams building SaaS tools, internal dashboards, admin portals, and full-stack products that need a reliable backend foundation from day one.
`,
  },
  "better-front-ends-with-fatboy-slim": {
    title: "React Storefront UI Kit",
    description:
      "A polished React frontend toolkit with responsive layouts, reusable UI sections, and modern storefront components designed for rapid development and clean user experiences.",
    content: `
# Product overview

React Storefront UI Kit is a React UI resource pack for teams that want stronger frontend foundations without rebuilding common patterns from scratch. It focuses on layout consistency, responsive components, and product-ready interface sections that feel closer to production work.

Built for developers who want production-style UI patterns and responsive design systems.

## What's included

- Responsive UI templates
- Reusable components for hero, card, and navigation sections
- Modern TypeScript-friendly structure
- Frontend optimisation patterns for smoother user flows

## Best for developers

Developers building ecommerce demos, SaaS marketing pages, internal tools, and customer-facing dashboards with React.
`,
  },
  "no-front-end-framework-is-the-best": {
    title: "Frontend Performance Toolkit",
    description:
      "A lightweight developer resource exploring modern frontend approaches, performance optimisation, and scalable component architecture without relying heavily on large frameworks.",
    content: `
# Product overview

Frontend Performance Toolkit is a developer resource for teams that value flexibility, performance, and maintainable structure. It highlights lighter frontend approaches, scalable component planning, and practical techniques for shipping polished interfaces without unnecessary complexity.

Focused on flexibility, clean structure, and performance-first design principles.

## What's included

- Lightweight UI architecture guidance
- Performance-first rendering ideas
- Reusable component planning notes
- Progressive enhancement patterns for modern storefronts

## Best for developers

Teams building custom storefronts, content-led sites, and framework-light frontend experiences that still need to scale cleanly.
`,
  },
  "visual-basic-is-the-future": {
    description:
      "A legacy workflow reference pack covering maintenance planning, migration notes, and documentation templates for teams supporting older business-critical systems.",
    content: `
# Product overview

Visual Basic is the future is a maintenance-focused developer resource for teams supporting long-running internal software. It emphasises documentation habits, upgrade planning, and practical workflows that reduce risk when working around older codebases.

Useful for developers managing maintenance-heavy applications and gradual modernisation work.

## What's included

- Legacy audit checklists
- Migration planning notes
- Documentation templates
- Maintenance workflow guidance

## Best for developers

Teams supporting internal business systems, staged rewrites, and older applications that still need dependable operational processes.
`,
  },
};

export function getStorefrontProduct(post: Post): Post {
  const overrides = storefrontProductCopy[post.urlId];

  if (!overrides) {
    return post;
  }

  return {
    ...post,
    ...overrides,
  };
}
