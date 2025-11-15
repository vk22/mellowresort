export function asHtml(richText) {
  if (!richText || !Array.isArray(richText)) return ''

  return richText
    .map(block => {
      switch (block.type) {
        case 'heading1':
          return `<h1>${block.text}</h1>`
        case 'heading2':
          return `<h2>${block.text}</h2>`
        case 'heading3':
          return `<h3>${block.text}</h3>`
        case 'paragraph':
          return block.text ? `<p>${block.text}</p>` : ''
        case 'list-item':
          return `<li>${block.text}</li>`
        case 'o-list-item':
          return `<li>${block.text}</li>`
        case 'image':
          return `<img src="${block.url}" alt="${block.alt || ''}" />`
        default:
          return block.text
      }
    })
    .join('\n')
}
