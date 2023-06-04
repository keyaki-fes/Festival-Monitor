import type { ServiceAccount } from 'firebase-admin'
import * as admin from 'firebase-admin'

const config: ServiceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
}

const firebaseAdmin =
  admin.apps[0] ??
  admin.initializeApp({ credential: admin.credential.cert(config) })
const db = firebaseAdmin.firestore()
const auth = firebaseAdmin.auth()

export { firebaseAdmin, db, auth }
