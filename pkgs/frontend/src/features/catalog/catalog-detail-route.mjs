function decodePathSegment(segment) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function catalogDetailSegments(path) {
  return String(path)
    .split(/[?#]/, 1)[0]
    .split("/")
    .filter(Boolean)
    .map(decodePathSegment);
}
