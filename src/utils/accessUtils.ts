import { Access } from 'payload'

export const isLoggedIn: Access = ({ req }) => {
  return !!req.user
}

export const isOwn: Access = ({ req }) => {
  if (!req.user) return false
  return {
    user: {
      equals: req.user.id,
    },
  }
}

export const isAdmin: Access = ({ req }) => {
  const user = req.user
  const docUser = req.data?.user
  return Boolean(
    user?.role === 'admin' || user?.id === (typeof docUser === 'object' ? docUser.id : docUser),
  )
}
