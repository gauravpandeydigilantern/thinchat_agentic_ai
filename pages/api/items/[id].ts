import { NextApiRequest, NextApiResponse } from 'next'
// Import your database client here (e.g., Prisma, Mongoose, etc.)
// Example: import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  try {
    switch (req.method) {
      case 'GET':
        // Fetch a single item by ID
        // const item = await prisma.item.findUnique({ where: { id: Number(id) } })
        res.status(200).json({ message: `Fetch item with ID: ${id}` })
        break

      case 'POST':
        // Create a new item
        // const newItem = await prisma.item.create({ data: req.body })
        res.status(201).json({ message: 'Create a new item', data: req.body })
        break

      case 'PUT':
        // Update an existing item by ID
        // const updatedItem = await prisma.item.update({ where: { id: Number(id) }, data: req.body })
        res.status(200).json({ message: `Update item with ID: ${id}`, data: req.body })
        break

      case 'DELETE':
        // Delete an item by ID
        // await prisma.item.delete({ where: { id: Number(id) } })
        res.status(200).json({ message: `Delete item with ID: ${id}` })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
