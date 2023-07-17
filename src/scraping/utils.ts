
export function normalizeRelativePageUrl(baseUrl: string, relative: string): string {
  if (relative.startsWith("/")) {
    let url = new URL(baseUrl)
    return `${url.protocol}//${url.hostname}${relative}`
  }

  return relative
}