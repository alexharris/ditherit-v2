import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/json; charset=utf-8')

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
          const fm = match[1]!
          const title = fm.match(/title:\s*(.+)/)?.[1]?.trim() ?? ''
          const date = fm.match(/date:\s*(.+)/)?.[1]?.trim() ?? ''
          const description = fm.match(/description:\s*(.+)/)?.[1]?.trim() ?? ''
          const draft = fm.match(/draft:\s*(.+)/)?.[1]?.trim() === 'true'
          const slug = file.replace(/\.md$/, '')
          return { title, date, description, draft, slug }
        })
    )
  )
    .filter((post: { draft: boolean } | null) => post && !post.draft)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime())

  return posts[0] ?? null
})
