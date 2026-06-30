import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import type { Lesson } from '@/payload-types'

export const dynamic = 'force-dynamic'

const LEVELS = [
  { label: 'All', value: '' },
  { label: 'Elementary School', value: 'elementary' },
  { label: 'Middle School', value: 'middle' },
  { label: 'High School', value: 'high' },
] as const

const levelLabels: Record<string, string> = {
  elementary: 'Elementary School',
  middle: 'Middle School',
  high: 'High School',
}

function formatBytes(bytes?: number | null): string {
  if (!bytes) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let i = 0
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(size >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

type Args = {
  searchParams: Promise<{ level?: string }>
}

export default async function LessonsPage({ searchParams }: Args) {
  const { level } = await searchParams
  const activeLevel = level && levelLabels[level] ? level : ''

  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'lessons',
    depth: 0,
    limit: 500,
    overrideAccess: false,
    sort: '-updatedAt',
    ...(activeLevel ? { where: { level: { equals: activeLevel } } } : {}),
  })

  const lessons = docs as Lesson[]

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-12">
        <div className="prose dark:prose-invert max-w-none mb-8">
          <h1>Lessons</h1>
          <p>Browse and download lesson PDFs by education level.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => {
            const isActive = activeLevel === l.value
            const href = l.value ? `/lessons?level=${l.value}` : '/lessons'
            return (
              <Link
                key={l.label}
                href={href}
                className={
                  'rounded-full border px-4 py-1.5 text-sm transition-colors ' +
                  (isActive
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:bg-card')
                }
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="container">
        {lessons.length === 0 ? (
          <p className="text-muted-foreground">No lessons available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <article
                key={lesson.id}
                className="flex flex-col rounded-lg border border-border bg-card p-5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-foreground/10 px-2 py-0.5 text-xs font-medium uppercase tracking-wide">
                    {levelLabels[lesson.level] ?? lesson.level}
                  </span>
                  {lesson.subject && (
                    <span className="text-xs text-muted-foreground">{lesson.subject}</span>
                  )}
                </div>

                <h3 className="mb-1 text-lg font-semibold">{lesson.title}</h3>

                {lesson.description && (
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                    {lesson.description}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatBytes(lesson.filesize)}
                  </span>
                  {lesson.url && (
                    <a
                      href={lesson.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Lessons | My Blog',
  }
}
