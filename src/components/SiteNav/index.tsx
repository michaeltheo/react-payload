import Link from 'next/link'
import React from 'react'

export const SiteNav: React.FC = () => {
  return (
    <header className="border-b border-border">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="font-semibold text-lg">
          My Blog
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/blogs" className="hover:underline">
            Blog
          </Link>
          <Link href="/lessons" className="hover:underline">
            Lessons
          </Link>
        </nav>
      </div>
    </header>
  )
}
