'use server'

import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { unstable_cache } from 'next/cache'

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user.email) {
    throw new Error('You need to be logged in to view this page.')
  }

  // Use unstable_cache to cache the order data with ISR-like behavior
  const getOrderWithCache = unstable_cache(
    async () => {
      const order = await db.order.findFirst({
        where: { id: orderId, userId: user.id },
        include: {
          billingAddress: true,
          configuration: true,
          shippingAddress: true,
          user: true,
        },
      })

      if (!order) throw new Error('This order does not exist.')

      if (order.isPaid) {
        return order
      } else {
        return false
      }
    },
    [`order-${orderId}-${user.id}`],
    {
      revalidate: 30, // Revalidate every 30 seconds
      tags: [`order-${orderId}`], // Add cache tag for targeted revalidation
    }
  )

  return getOrderWithCache()
}