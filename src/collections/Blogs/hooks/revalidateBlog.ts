import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Blog } from '../../../payload-types'

export const revalidateBlog: CollectionAfterChangeHook<Blog> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/blogs/${doc.slug}`

      payload.logger.info(`Revalidating blog at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/')
      revalidateTag('blogs-sitemap', 'max')
    }

    // If the blog was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/blogs/${previousDoc.slug}`

      payload.logger.info(`Revalidating old blog at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/')
      revalidateTag('blogs-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Blog> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/blogs/${doc?.slug}`

    revalidatePath(path)
    revalidatePath('/')
    revalidateTag('blogs-sitemap', 'max')
  }

  return doc
}
