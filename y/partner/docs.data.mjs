import { createContentLoader } from 'vitepress'

export default createContentLoader('partner/*.md', {
  transform(rawData) {
    return rawData
      .filter(page => page.url !== '/partner/')
      .map(page => ({
        title: page.frontmatter.title,
        description: page.frontmatter.description,
        url: page.url
      }))

      .sort((a, b) => {
        if (!a.title || !b.title) return 0;
        return a.title.localeCompare(b.title);
      })
  }
})