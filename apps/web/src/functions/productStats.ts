export function getProductViewsLabel(views: number) {
  if (views <= 0) {
    return "New product";
  }

  return `${views} product ${views === 1 ? "view" : "views"}`;
}
