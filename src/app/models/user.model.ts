// User model for Firestore
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'medidor';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  photoURL?: string;
}
