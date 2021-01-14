
export function getOrigin(url: string): string {
  const origin =  new URL(url).origin

  if (!origin) {
    throw new Error('cannot extract origin')
  }

  return origin
}
