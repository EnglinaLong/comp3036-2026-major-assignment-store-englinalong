export function getProductPrice(postId: number) {
  const dollars = 39 + postId * 14;
  return `$${dollars}.00`;
}
