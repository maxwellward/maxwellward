export function getDeobfuscatedEmail(emailEl: HTMLElement): string {
  let email = '';
  emailEl.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      email += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (!el.matches(':nth-child(2n)')) {
        email += node.textContent;
      }
    }
  });
  return email;
}

export async function copyEmailToClipboard(email: string, button: HTMLButtonElement): Promise<void> {
  await navigator.clipboard.writeText(email);
  button.classList.add('copied');
  setTimeout(() => {
    button.classList.remove('copied');
  }, 1500);
}
