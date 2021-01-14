export function getRemoteWindow(iframe: HTMLIFrameElement): Promise<Window> {
  return new Promise((resolve, reject) => {
    iframe.addEventListener("load", () => {
      const remoteWindow = iframe.contentWindow;
      if (!remoteWindow) {
        return reject(new Error("remote window is null"));
      }
      resolve(remoteWindow);
    });
  });
}
