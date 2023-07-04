import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

function updateDatabaseURL(schema: string) {
  process.env.DATABASE_URL = generateDatabaseURL(schema)
}

async function runMigrations() {
  execSync('npx prisma migrate deploy')
}

async function deleteSchema(schema: string) {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
}

async function disconnectDatabase() {
  await prisma.$disconnect()
}

export default <Environment>{
  name: 'prisma-test-environment',
  async setup() {
    const schema = randomUUID()

    updateDatabaseURL(schema)
    await runMigrations()

    return {
      async teardown() {
        await deleteSchema(schema)
        await disconnectDatabase()
      },
    }
  },
}
