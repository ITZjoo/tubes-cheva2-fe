import api from '../../../services/api'

// There's no self-service "/me" update endpoint on the backend — the only
// way to change the logged-in user's own name/phone/password is the
// admin-only PUT /users/:id (which the logged-in admin can call against
// their own id). It accepts a partial { name?, phone?, password? } body and
// applies it directly via Prisma, so only send fields you actually want
// changed — anything else (e.g. email) isn't a column PUT /users/:id knows
// how to touch here.
//
// Note: the backend does NOT verify `oldPassword` before accepting a new
// one — updateUser() just hashes and overwrites `password` unconditionally.
// The old-password field in the UI is a client-side-only gate, not real
// verification; that's a backend limitation, not something fixable from FE.
export function updateAccount(userId, payload) {
  return api.put(`/users/${userId}`, payload)
}
