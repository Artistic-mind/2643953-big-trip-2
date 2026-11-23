const ESCAPED_SYMBOLS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtml = (value = '') =>
  String(value).replace(
    /[&<>"']/g,
    (symbol) => ESCAPED_SYMBOLS[symbol]
  );
