export function staticMemberHref(href) {
  const match = href.match(/^(\/catalog\/(?:repositories|packages)\/[^/?#]+\/[^/?#]+)\/?([?#].*)?$/);
  return match ? match[1] + "/" + (match[2] || "") : href;
}
