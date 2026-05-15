type ProductRecord = {
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

export const POST_OVERRIDES_STORAGE_KEY = "admin-post-overrides";
export const CREATED_POSTS_STORAGE_KEY = "admin-created-posts";
export const LOCAL_PRODUCT_STATE_EVENT = "local-product-state:change";

function normalizeStoredPost(post: ProductRecord) {
  return {
    ...post,
    date: new Date(post.date),
  };
}

type LocalProductState = {
  createdPosts: ProductRecord[];
  postOverrides: Record<string, Partial<ProductRecord>>;
};

function normalizeStoredOverride(override: Partial<ProductRecord>) {
  const { date: _date, ...rest } = override;
  return rest;
}

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function readJson<T>(storage: Storage, key: string, fallback: T) {
  const rawValue = storage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  return JSON.parse(rawValue) as T;
}

function notifyLocalProductStateChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(LOCAL_PRODUCT_STATE_EVENT));
}

export function readLocalProductState(): LocalProductState {
  const storage = getStorage();

  if (!storage) {
    return {
      createdPosts: [],
      postOverrides: {},
    };
  }

  try {
    const createdPosts = readJson<ProductRecord[]>(
      storage,
      CREATED_POSTS_STORAGE_KEY,
      [],
    )
      .map(normalizeStoredPost);
    const storedOverrides = readJson<Record<string, Partial<ProductRecord>>>(
      storage,
      POST_OVERRIDES_STORAGE_KEY,
      {},
    );
    const postOverrides = Object.fromEntries(
      Object.entries(storedOverrides).map(([urlId, override]) => [
        urlId,
        normalizeStoredOverride(override),
      ]),
    );

    return {
      createdPosts,
      postOverrides,
    };
  } catch {
    storage.removeItem(CREATED_POSTS_STORAGE_KEY);
    storage.removeItem(POST_OVERRIDES_STORAGE_KEY);

    return {
      createdPosts: [],
      postOverrides: {},
    };
  }
}

export function mergeLocalProducts(posts: ProductRecord[]) {
  const { createdPosts, postOverrides } = readLocalProductState();
  const mergedPosts = [
    ...createdPosts.filter(
      (createdPost) =>
        !posts.some(
          (post) =>
            post.urlId === createdPost.urlId || post.id === createdPost.id,
        ),
    ),
    ...posts,
  ];

  return mergedPosts.map((post) => {
    const override = postOverrides[post.urlId];

    return {
      ...post,
      ...override,
      active: override?.active ?? post.active,
      date: new Date(post.date),
    };
  });
}

export function upsertCreatedProduct(post: ProductRecord) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const { createdPosts } = readLocalProductState();
  const nextCreatedPosts = [
    ...createdPosts.filter((item) => item.urlId !== post.urlId),
    normalizeStoredPost(post),
  ];

  storage.setItem(CREATED_POSTS_STORAGE_KEY, JSON.stringify(nextCreatedPosts));
  notifyLocalProductStateChanged();
}

export function upsertProductOverride(
  urlId: string,
  override: Partial<ProductRecord>,
) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const { postOverrides } = readLocalProductState();
  const nextOverride = normalizeStoredOverride(override);
  storage.setItem(
    POST_OVERRIDES_STORAGE_KEY,
    JSON.stringify({
      ...postOverrides,
      [urlId]: {
        ...postOverrides[urlId],
        ...nextOverride,
      },
    }),
  );
  notifyLocalProductStateChanged();
}

export function subscribeToLocalProductState(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorage(event: StorageEvent) {
    if (
      event.key !== null &&
      event.key !== CREATED_POSTS_STORAGE_KEY &&
      event.key !== POST_OVERRIDES_STORAGE_KEY
    ) {
      return;
    }

    callback();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(LOCAL_PRODUCT_STATE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LOCAL_PRODUCT_STATE_EVENT, callback);
  };
}
