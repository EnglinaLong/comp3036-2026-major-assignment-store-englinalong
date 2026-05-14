"use client";

import { marked } from "marked";
import { useId, useRef, useState, type ReactNode } from "react";
import type { Post } from "@repo/db/data";

const PRODUCT_PRICE_OVERRIDES_COOKIE = "store-product-price-overrides";

type PostEditorProps = {
  postId?: number;
  initialPost: Pick<
    Post,
    "title" | "category" | "description" | "content" | "imageUrl" | "tags"
  >;
};

type FormValues = {
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  price: string;
  tags: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues) {
  const errors: FormErrors = {};

  if (!values.title.trim()) {
    errors.title = "Product name is required";
  }

  if (!values.category.trim()) {
    errors.category = "Product category is required";
  }

  if (!values.description.trim()) {
    errors.description = "Product summary is required";
  } else if (values.description.length > 200) {
    errors.description =
      "Product summary is too long. Maximum is 200 characters";
  }

  if (!values.content.trim()) {
    errors.content = "Product details are required";
  }

  if (!values.imageUrl.trim()) {
    errors.imageUrl = "Product image URL is required";
  } else {
    try {
      new URL(values.imageUrl);
    } catch {
      errors.imageUrl = "This is not a valid URL";
    }
  }

  const parsedPrice = Number.parseFloat(values.price);

  if (!values.price.trim()) {
    errors.price = "Price is required";
  } else if (!Number.isFinite(parsedPrice)) {
    errors.price = "Price must be a valid number";
  } else if (parsedPrice <= 0) {
    errors.price = "Price must be greater than 0";
  }

  if (!values.tags.trim()) {
    errors.tags = "At least one product tag or collection is required";
  }

  return errors;
}

function slugifyTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getConfiguredPrice(title: string) {
  const configuredPrices: Record<string, number> = {
    "boost-your-conversion-rate": 89,
    "better-front-ends-with-fatboy-slim": 79,
    "no-front-end-framework-is-the-best": 64,
    "visual-basic-is-the-future": 49,
  };

  return configuredPrices[slugifyTitle(title)];
}

function getFallbackPrice(postId: number | undefined, category: string) {
  const categoryBasePrice: Record<string, number> = {
    react: 74,
    node: 82,
    "next.js": 94,
    analytics: 69,
    optimisation: 59,
  };

  if (!postId) {
    return "";
  }

  const base = categoryBasePrice[category.trim().toLowerCase()] ?? 67;
  return String(base + ((postId % 3) * 5));
}

function readStoredPrice(title: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${PRODUCT_PRICE_OVERRIDES_COOKIE}=`))
    ?.split("=")[1];

  if (!cookieValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      decodeURIComponent(cookieValue),
    ) as Record<string, number>;
    const slugKey = slugifyTitle(title);
    return parsed[slugKey] ?? null;
  } catch {
    return null;
  }
}

function storePriceOverride(price: number, title: string) {
  if (typeof document === "undefined") {
    return;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${PRODUCT_PRICE_OVERRIDES_COOKIE}=`))
    ?.split("=")[1];

  let overrides: Record<string, number> = {};

  if (cookieValue) {
    try {
      overrides = JSON.parse(decodeURIComponent(cookieValue)) as Record<
        string,
        number
      >;
    } catch {
      overrides = {};
    }
  }

  const slugKey = slugifyTitle(title);
  overrides[slugKey] = price;

  document.cookie = `${PRODUCT_PRICE_OVERRIDES_COOKIE}=${encodeURIComponent(
    JSON.stringify(overrides),
  )}; path=/; max-age=31536000; SameSite=Lax`;
}

export function PostEditor({ postId, initialPost }: PostEditorProps) {
  const [values, setValues] = useState<FormValues>({
    ...initialPost,
    price: String(
      readStoredPrice(initialPost.title) ??
        getConfiguredPrice(initialPost.title) ??
        getFallbackPrice(postId, initialPost.category),
    ),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showSaveError, setShowSaveError] = useState(false);

  const contentId = useId();
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const savedSelectionRef = useRef<{ start: number; end: number } | null>(null);

  const isCreateMode = !initialPost.title.trim();

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSaveMessage("");
    setShowSaveError(false);

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSave = async () => {
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setShowSaveError(true);
      setSaveMessage("");
      return;
    }

    if (!isCreateMode) {
      if (!postId) {
        setShowSaveError(true);
        setSaveMessage("");
        return;
      }

      const response = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setShowSaveError(true);
        setSaveMessage("");
        return;
      }
    } else {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setShowSaveError(true);
        setSaveMessage("");
        return;
      }
    }

    storePriceOverride(Number.parseFloat(values.price), values.title);
    setShowSaveError(false);
    setSaveMessage(
      isCreateMode
        ? "Product created successfully"
        : "Product updated successfully",
    );
  };

  const togglePreview = () => {
    if (!isPreviewOpen) {
      const textarea = contentRef.current;

      if (textarea) {
        savedSelectionRef.current = {
          start: textarea.selectionStart,
          end: textarea.selectionEnd,
        };
      }

      setIsPreviewOpen(true);
      return;
    }

    setIsPreviewOpen(false);

    queueMicrotask(() => {
      const textarea = contentRef.current;
      const selection = savedSelectionRef.current;

      if (textarea && selection) {
        textarea.focus();
        textarea.setSelectionRange(selection.start, selection.end);
      }
    });
  };

  const showImagePreview = values.imageUrl.trim() !== "";

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2.5rem 2rem",
        backgroundColor: "#ffffff",
      }}
    >
      <h1
        style={{
          marginBottom: "1.5rem",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        {isCreateMode ? "Create Product" : "Update Product"}
      </h1>

      {showSaveError ? (
        <p style={{ color: "#b91c1c", marginBottom: "1rem" }}>
          Please fix the product details before saving
        </p>
      ) : null}

      {saveMessage ? (
        <p style={{ color: "#15803d", marginBottom: "1rem" }}>{saveMessage}</p>
      ) : null}

      <div
        style={{
          display: "grid",
          gap: "1.25rem",
        }}
      >
        <Field label="Product Name" htmlFor="title" error={errors.title}>
          <input
            id="title"
            value={values.title}
            onChange={(event) => updateValue("title", event.target.value)}
            placeholder="React Dashboard UI Kit"
            style={{
              ...inputStyle,
              border: errors.title ? "1px solid #dc2626" : inputStyle.border,
            }}
          />
        </Field>

        <Field
          label="Product Category"
          htmlFor="category"
          error={errors.category}
        >
          <input
            id="category"
            value={values.category}
            onChange={(event) => updateValue("category", event.target.value)}
            placeholder="React"
            style={{
              ...inputStyle,
              border: errors.category ? "1px solid #dc2626" : inputStyle.border,
            }}
          />
        </Field>

        <Field
          label="Product Summary"
          htmlFor="description"
          error={errors.description}
        >
          <textarea
            id="description"
            value={values.description}
            onChange={(event) => updateValue("description", event.target.value)}
            rows={4}
            placeholder="A responsive dashboard template with reusable React components."
            style={{
              ...textAreaStyle,
              border: errors.description
                ? "1px solid #dc2626"
                : textAreaStyle.border,
            }}
          />
          <p
            style={{
              color: "#6b7280",
              marginTop: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            {values.description.length} / 200 characters
          </p>
        </Field>

        <div>
          <label
            htmlFor={contentId}
            style={{
              display: "block",
              fontWeight: 700,
              fontSize: "1rem",
              marginBottom: "0.5rem",
              color: "#111827",
            }}
          >
            Product Details
          </label>

          <button
            type="button"
            onClick={togglePreview}
            style={secondaryButtonStyle}
          >
            {isPreviewOpen ? "Close Preview" : "Preview"}
          </button>

          {isPreviewOpen ? (
            <div
              data-test-id="content-preview"
              style={previewStyle}
              dangerouslySetInnerHTML={{ __html: marked.parse(values.content) }}
            />
          ) : (
            <textarea
              id={contentId}
              ref={contentRef}
              value={values.content}
              onChange={(event) => updateValue("content", event.target.value)}
              rows={10}
              placeholder="Outline the product overview, what is included, setup notes, and ideal use cases for your storefront resource."
              style={{
                ...textAreaStyle,
                marginTop: "0.75rem",
                border: errors.content
                  ? "1px solid #dc2626"
                  : textAreaStyle.border,
              }}
            />
          )}

          {errors.content ? <p style={errorStyle}>{errors.content}</p> : null}
        </div>

        <Field
          label="Product Image URL"
          htmlFor="image-url"
          error={errors.imageUrl}
        >
          <input
            id="image-url"
            value={values.imageUrl}
            onChange={(event) => updateValue("imageUrl", event.target.value)}
            placeholder="https://images.unsplash.com/example-product-image"
            style={{
              ...inputStyle,
              border: errors.imageUrl
                ? "1px solid #dc2626"
                : inputStyle.border,
            }}
          />
        </Field>

        <Field label="Price" htmlFor="price" error={errors.price}>
          <input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            value={values.price}
            onChange={(event) => updateValue("price", event.target.value)}
            placeholder="72.00"
            style={{
              ...inputStyle,
              border: errors.price ? "1px solid #dc2626" : inputStyle.border,
            }}
          />
        </Field>

        {showImagePreview ? (
          <img
            src={values.imageUrl}
            alt="Product preview"
            data-test-id="image-preview"
            style={{
              width: "280px",
              maxWidth: "100%",
              borderRadius: "0.75rem",
              border: "1px solid #d1d5db",
            }}
          />
        ) : null}

        <Field
          label="Product Tags / Collections"
          htmlFor="tags"
          error={errors.tags}
        >
          <input
            id="tags"
            value={values.tags}
            onChange={(event) => updateValue("tags", event.target.value)}
            placeholder="Front-End, UI Design, Storefront"
            style={{
              ...inputStyle,
              border: errors.tags ? "1px solid #dc2626" : inputStyle.border,
            }}
          />
        </Field>

        <div>
          <button type="button" onClick={handleSave} style={primaryButtonStyle}>
            Save Product
          </button>
        </div>
      </div>
    </main>
  );
}

function Field({
  children,
  error,
  label,
  htmlFor,
}: {
  children: ReactNode;
  error?: string;
  label: string;
  htmlFor?: string;
}) {
  const id = htmlFor ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontWeight: 700,
          fontSize: "1rem",
          marginBottom: "0.5rem",
          color: "#111827",
        }}
      >
        {label}
      </label>
      {children}
      {error ? <p style={errorStyle}>{error}</p> : null}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.85rem 1rem",
  border: "1px solid #d1d5db",
  borderRadius: "0.75rem",
  boxSizing: "border-box" as const,
  fontSize: "1rem",
  color: "#111827",
  backgroundColor: "#ffffff",
};

const textAreaStyle = {
  ...inputStyle,
  fontFamily: "inherit",
  resize: "vertical" as const,
};

const primaryButtonStyle = {
  padding: "0.85rem 1.5rem",
  backgroundColor: "#374151",
  color: "white",
  border: "none",
  borderRadius: "0.75rem",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "1rem",
};

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  backgroundColor: "#374151",
};

const previewStyle = {
  marginTop: "0.75rem",
  padding: "1rem",
  border: "1px solid #d1d5db",
  borderRadius: "0.75rem",
  backgroundColor: "#f9fafb",
};

const errorStyle = {
  color: "#b91c1c",
  marginTop: "0.5rem",
};
