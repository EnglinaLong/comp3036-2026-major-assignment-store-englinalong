import type { Post } from "@repo/db/data";

const productPricing: Record<
  string,
  {
    amount: number;
    supportingText: string;
  }
> = {
  "boost-your-conversion-rate": {
    amount: 89,
    supportingText: "Includes complete product files and backend setup resources.",
  },
  "better-front-ends-with-fatboy-slim": {
    amount: 79,
    supportingText: "Instant access included after purchase.",
  },
  "no-front-end-framework-is-the-best": {
    amount: 64,
    supportingText: "Built for modern full-stack development workflows.",
  },
  "visual-basic-is-the-future": {
    amount: 49,
    supportingText: "Includes planning guides, templates, and reference notes.",
  },
};

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function fallbackPrice(post: Pick<Post, "id" | "category">) {
  const categoryBasePrice: Record<string, number> = {
    react: 74,
    node: 82,
    "next.js": 94,
    analytics: 69,
    optimisation: 59,
  };

  const base =
    categoryBasePrice[post.category.trim().toLowerCase()] ?? 67;

  return base + ((post.id % 3) * 5);
}

function getConfiguredPrice(
  post: Pick<Post, "id" | "urlId" | "category" | "price">,
) {
  if (post.price > 0) {
    return post.price;
  }

  return productPricing[post.urlId]?.amount ?? fallbackPrice(post);
}

export function getDefaultProductPrice(
  post: Pick<Post, "id" | "urlId" | "category" | "price">,
) {
  return formatCurrency(getConfiguredPrice(post));
}

export function getProductPrice(
  post: Pick<Post, "id" | "urlId" | "category" | "price">,
) {
  return formatCurrency(getConfiguredPrice(post));
}

export function getProductPriceSupportingText(
  post: Pick<Post, "urlId" | "category" | "supportingText">,
) {
  if (post.supportingText.trim()) {
    return post.supportingText;
  }

  const configuredText = productPricing[post.urlId]?.supportingText;

  if (configuredText) {
    return configuredText;
  }

  switch (post.category.trim().toLowerCase()) {
    case "react":
    case "next.js":
      return "Includes complete product files and setup resources.";
    case "node":
      return "Built for modern full-stack development workflows.";
    default:
      return "Instant access included after purchase.";
  }
}
