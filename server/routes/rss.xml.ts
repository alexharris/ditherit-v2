import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  const contentDir = join(process.cwd(), 'content/blog')
  const files = await readdir(contentDir)

  const posts = (
    await Promise.all(
      files
        .filter(f => f.endsWith('.md'))
        .map(async (file) => {
          const raw = await readFile(join(contentDir, file), 'utf-8')
          const match = raw.match(/^---\n([\s\S]*?)\n---/)
          if (!match) return null
          const fm = match[1]
          const title = fm.match(/title:\s*(.+)/)?.[1]?.trim() ?? ''
          const date = fm.match(/date:\s*(.+)/)?.[1]?.trim() ?? ''
          const description = fm.match(/description:\s*(.+)/)?.[1]?.trim() ?? ''
          return { title, date, description }
        })
    )
  )
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime())

  const siteUrl = 'https://ditherit.com'

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dither it! Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Updates and news from Dither it!</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts.map(post => `<item>
      <title>${escapeXml(post!.title)}</title>
      <link>${siteUrl}/blog</link>
      <description>${escapeXml(post!.description)}</description>
      <pubDate>${new Date(post!.date).toUTCString()}</pubDate>
      <guid isPermaLink="false">${siteUrl}/blog#${post!.date}</guid>
    </item>`).join('\n    ')}
  </channel>
</rss>`

  return xml
})
