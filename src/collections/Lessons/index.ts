import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { revalidateLesson, revalidateLessonDelete } from './hooks/revalidateLesson'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  labels: {
    singular: 'Lesson',
    plural: 'Lessons',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'level', 'subject', 'updatedAt'],
    useAsTitle: 'title',
    description: 'Upload PDF lessons and tag them by education level.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'level',
      type: 'select',
      required: true,
      admin: {
        description: 'Which education level this lesson is for.',
      },
      options: [
        { label: 'Elementary School', value: 'elementary' },
        { label: 'Middle School', value: 'middle' },
        { label: 'High School', value: 'high' },
      ],
    },
    {
      name: 'subject',
      type: 'text',
      admin: {
        description: 'e.g. Mathematics, History, Biology',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
  upload: {
    // Stored outside /public; served securely via Payload's /api/lessons/file/<filename> route
    staticDir: path.resolve(dirname, '../../../lessons-uploads'),
    mimeTypes: ['application/pdf'],
  },
  hooks: {
    afterChange: [revalidateLesson],
    afterDelete: [revalidateLessonDelete],
  },
}
