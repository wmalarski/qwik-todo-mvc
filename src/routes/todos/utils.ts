export const trimPathname = (url: URL) => {
  return url.pathname.split("/").slice(0, 3).join("/");
};
