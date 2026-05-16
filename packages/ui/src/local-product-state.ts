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
const POST_OVERRIDES_COOKIE_KEY = "shared-admin-post-overrides";
const CREATED_POSTS_COOKIE_KEY = "shared-admin-created-posts";
const PRODUCT_STATE_SESSION_COOKIE_KEY = "shared-product-state-session";

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

function getCookieValue(key: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${key}=`))
    ?.slice(key.length + 1);

  if (!cookieValue) {
    return null;
  }

  try {
    return decodeURIComponent(cookieValue);
  } catch {
    return null;
  }
}

function setCookieValue(key: string, value: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${key}=${encodeURIComponent(
    value,
  )}; path=/; max-age=31536000; SameSite=Lax`;
}

function setSessionCookieValue(key: string, value: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${key}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
}

function removeCookieValue(key: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`;
}

function getSharedStateValue(
  storage: Storage,
  storageKey: string,
  cookieKey: string,
) {
  const cookieValue = getCookieValue(cookieKey);

  if (cookieValue) {
    setSessionCookieValue(PRODUCT_STATE_SESSION_COOKIE_KEY, "1");
    storage.setItem(storageKey, cookieValue);
    return cookieValue;
  }

  const storageValue = storage.getItem(storageKey);

  if (storageValue) {
    setSessionCookieValue(PRODUCT_STATE_SESSION_COOKIE_KEY, "1");
    setCookieValue(cookieKey, storageValue);
    return storageValue;
  }

  return null;
}

function setSharedStateValue(
  storage: Storage,
  storageKey: string,
  cookieKey: string,
  value: string,
) {
  storage.setItem(storageKey, value);
  setSessionCookieValue(PRODUCT_STATE_SESSION_COOKIE_KEY, "1");
  setCookieValue(cookieKey, value);
}

function removeSharedStateValue(
  storage: Storage,
  storageKey: string,
  cookieKey: string,
) {
  storage.removeItem(storageKey);
  removeCookieValue(cookieKey);
}

function readJson<T>(storage: Storage, key: string, fallback: T) {
  const rawValue =
    key === CREATED_POSTS_STORAGE_KEY
      ? getSharedStateValue(storage, key, CREATED_POSTS_COOKIE_KEY)
      : key === POST_OVERRIDES_STORAGE_KEY
        ? getSharedStateValue(storage, key, POST_OVERRIDES_COOKIE_KEY)
        : storage.getItem(key);

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
    removeSharedStateValue(
      storage,
      CREATED_POSTS_STORAGE_KEY,
      CREATED_POSTS_COOKIE_KEY,
    );
    removeSharedStateValue(
      storage,
      POST_OVERRIDES_STORAGE_KEY,
      POST_OVERRIDES_COOKIE_KEY,
    );

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
    ...createdPosts.filter(
      (item) => item.urlId !== post.urlId && item.id !== post.id,
    ),
    normalizeStoredPost(post),
  ];

  setSharedStateValue(
    storage,
    CREATED_POSTS_STORAGE_KEY,
    CREATED_POSTS_COOKIE_KEY,
    JSON.stringify(nextCreatedPosts),
  );
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
  setSharedStateValue(
    storage,
    POST_OVERRIDES_STORAGE_KEY,
    POST_OVERRIDES_COOKIE_KEY,
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
