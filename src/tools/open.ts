export const openNativeLink = (url: string) => new Promise<void>((resolve) => {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('src', url)
  iframe.style.width = "0";
  iframe.style.height = "0";
  document.body.appendChild(iframe);

  setTimeout(() => {
    window.document.body.removeChild(iframe);
    resolve()
  }, 100)
})
