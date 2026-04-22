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

function markdownToHtml(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let inList = false

  for (const raw of lines) {
    const line = raw.trimEnd()

    // Headings
    const hMatch = line.match(/^(#{1,6})\s+(.+)/)
    if (hMatch) {
      if (inList) { out.push('</ul>'); inList = false }
      const level = hMatch[1]!.length
      out.push(`<h${level}>${inlineMarkdown(hMatch[2]!)}</h${level}>`)
      continue
    }

    // List items
    const liMatch = line.match(/^[-*]\s+(.+)/)
    if (liMatch) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${inlineMarkdown(liMatch[1]!)}</li>`)
      continue
    }

    // Close list on blank or non-list line
    if (inList) { out.push('</ul>'); inList = false }

    // Blank line — paragraph break (skip, handled by block wrapping)
    if (!line.trim()) {
      out.push('')
      continue
    }

    out.push(`<p>${inlineMarkdown(line)}</p>`)
  }

  if (inList) out.push('</ul>')

  // Collapse consecutive blank lines
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
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
          const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
          if (!match) return null
          const fm = match[1]!
          const body = match[2]!.trim()
          const title = fm.match(/title:\s*(.+)/)?.[1]?.trim() ?? ''
          const date = fm.match(/date:\s*(.+)/)?.[1]?.trim() ?? ''
          const description = fm.match(/description:\s*(.+)/)?.[1]?.trim() ?? ''
          const slug = file.replace(/\.md$/, '')
          return { title, date, description, body, slug }
        })
    )
  )
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime())

  const siteUrl = 'https://ditherit.com'

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Dither it! Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Updates and news from Dither it!</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts.map(post => `<item>
      <title>${escapeXml(post!.title)}</title>
      <link>${siteUrl}/blog/${post!.slug}</link>
      <description>${escapeXml(post!.description)}</description>
      <content:encoded><![CDATA[${markdownToHtml(post!.body)}]]></content:encoded>
      <pubDate>${new Date(post!.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteUrl}/blog/${post!.slug}</guid>
    </item>`).join('\n    ')}
  </channel>
</rss>`

  return xml
})
