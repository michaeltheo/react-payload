import { seoPlugin } from '@payloadcms/plugin-seo'
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
]
