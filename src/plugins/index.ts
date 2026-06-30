import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Blog } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Blog> = ({ doc }) => {
  return doc?.title ? `${doc.title} | My Blog` : 'My Blog'
}

const generateURL: GenerateURL<Blog> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/blogs/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  // Stores uploaded files (PDFs + images) in Vercel Blob object storage.
  // Required on Vercel because its filesystem is read-only/ephemeral.
  // Disabled locally when no token is set, so local dev falls back to disk.
  vercelBlobStorage({
    enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    collections: {
      media: true,
      lessons: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN || '',
  }),
]
