export function getProductViewsLabel(views: number) {
  if (views <= 0) {
    return "New product";
  }

  return `${views} product ${views === 1 ? "view" : "views"}`;
}

export function getWishlistSavesLabel(saves: number) {
  if (saves <= 0) {
    return "No wishlist saves yet";
  }

  return `${saves} wishlist ${saves === 1 ? "save" : "saves"}`;
}
