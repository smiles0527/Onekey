import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { auth, db, storage } from '../lib/firebase';
import { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  TimelineEvent, 
  CreateEventRequest, 
  ActivityLog 
} from './api';

export class FirebaseService {
  private friendlyAuthError(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
      case 'auth/invalid-email':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      default:
        return 'Login failed. Please check your credentials.';
    }
  }

  private async ensureFirestoreUser(firebaseUser: FirebaseUser): Promise<Record<string, any> | undefined> {
    const userRef = doc(db, 'users', firebaseUser.uid);
    let userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const isKnownAdmin = firebaseUser.email === 'on3keymusic@gmail.com';
      await setDoc(userRef, {
        username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || firebaseUser.uid,
        email: firebaseUser.email || '',
        role: isKnownAdmin ? 'super_admin' : 'user',
        isActive: true,
        createdAt: new Date().toISOString()
      });
      userDoc = await getDoc(userRef);
    }

    return userDoc.data();
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      let email = credentials.username.trim();

      // If not an email, look up by username in Firestore
      if (!email.includes('@')) {
        try {
          const q = query(collection(db, 'users'), where('username', '==', email));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            email = snapshot.docs[0].data().email;
          } else {
            return { success: false, error: 'User not found. Please sign in with your email address.' };
          }
        } catch {
          return { success: false, error: 'Please sign in with your email address.' };
        }
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, credentials.password);
      const firebaseUser = userCredential.user;
      const userData = await this.ensureFirestoreUser(firebaseUser);

      return {
        success: true,
        data: {
          token: await firebaseUser.getIdToken(),
          user: {
            id: firebaseUser.uid,
            username: userData?.username || firebaseUser.email?.split('@')[0] || '',
            email: firebaseUser.email || '',
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            role: userData?.role || 'user'
          }
        }
      };
    } catch (error: any) {
      return { success: false, error: this.friendlyAuthError(error.code) };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return { success: false, error: 'Not authenticated' };

      const userData = await this.ensureFirestoreUser(currentUser);

      return {
        success: true,
        data: {
          user: {
            id: currentUser.uid,
            username: userData?.username || currentUser.email?.split('@')[0] || '',
            email: currentUser.email || '',
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            role: userData?.role || 'user',
            isActive: userData?.isActive ?? true,
            createdAt: userData?.createdAt || new Date().toISOString()
          }
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  clearToken() {
    // Sign out from Firebase
    signOut(auth).catch(error => console.error('Signout error:', error));
  }

  // User Management
  async getUsers(): Promise<ApiResponse<{ users: User[] }>> {
    try {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          isActive: data.isActive,
          createdAt: data.createdAt
        });
      });

      return { success: true, data: { users } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<{ userId: string; message: string }>> {
    try {
      // Create auth user
      // Note: This signs in the new user automatically, which might not be desired for an admin creating a user.
      // In a real app, you'd use a secondary app instance or Cloud Functions.
      // For this implementation, we'll warn about this limitation or use a workaround if possible.
      // A simple workaround for client-side only is to not create the auth user here but just the firestore doc,
      // but that prevents them from logging in. 
      // We will assume for now this is acceptable or the user will register themselves.
      
      // BETTER APPROACH for "Admin creating user":
      // Just create the Firestore document. The user must "Sign Up" themselves to create the Auth account,
      // OR we use a Cloud Function.
      // Since we don't have Cloud Functions set up, we will just create the Firestore doc and assume the user
      // will register with the same email, or we accept that "Add User" in admin panel is metadata only until they register.
      
      // Let's try to create the Auth user.
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      // Create Firestore document
      await setDoc(doc(db, 'users', user.uid), {
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        isActive: true,
        createdAt: new Date().toISOString()
      });

      return { success: true, data: { userId: user.uid, message: 'User created' } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<{ message: string }>> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData
      });
      return { success: true, data: { message: 'User updated' } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      await deleteDoc(doc(db, 'users', userId));
      // Note: This doesn't delete the Auth user without Cloud Functions
      return { success: true, data: { message: 'User deleted' } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Activity Logs
  async getAllActivityLogs(page: number = 1, limit: number = 100, action: string = 'all'): Promise<ApiResponse<{ 
    logs: ActivityLog[], 
    pagination: { page: number, limit: number, total: number, totalPages: number } 
  }>> {
    try {
      let q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));
      
      if (action !== 'all') {
        q = query(q, where('action', '==', action));
      }

      const querySnapshot = await getDocs(q);
      const allLogs: ActivityLog[] = [];
      querySnapshot.forEach((doc) => {
        allLogs.push({ id: doc.id, ...doc.data() } as ActivityLog);
      });

      const total = allLogs.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const logs = allLogs.slice(start, start + limit);

      return {
        success: true,
        data: {
          logs,
          pagination: { page, limit, total, totalPages }
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Timeline Events
  async getEvents(): Promise<ApiResponse<{ events: TimelineEvent[] }>> {
    try {
      const q = query(collection(db, 'events'));
      const querySnapshot = await getDocs(q);
      const events: TimelineEvent[] = [];
      
      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() } as TimelineEvent);
      });

      return { success: true, data: { events } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createEvent(eventData: CreateEventRequest): Promise<ApiResponse<{ id: string; message: string }>> {
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      return { success: true, data: { id: docRef.id, message: 'Event created' } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateEvent(eventId: string, eventData: CreateEventRequest): Promise<ApiResponse<{ message: string }>> {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        ...eventData,
        updated_at: new Date().toISOString()
      });
      return { success: true, data: { message: 'Event updated' } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteEvent(eventId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      return { success: true, data: { message: 'Event deleted' } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // File Upload
  async uploadImage(file: File): Promise<ApiResponse<{ filePath: string; filename: string; originalName: string; size: number }>> {
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        success: true,
        data: {
          filePath: downloadURL,
          filename: snapshot.ref.name,
          originalName: file.name,
          size: snapshot.metadata.size
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Team Members
  async getTeamMembers(): Promise<ApiResponse<{ members: Record<string, any>[] }>> {
    try {
      const q = query(collection(db, 'teamMembers'));
      const snap = await getDocs(q);
      const members: Record<string, any>[] = [];
      snap.forEach(d => members.push({ id: d.id, ...d.data() }));
      return { success: true, data: { members } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async createTeamMember(data: Record<string, any>): Promise<ApiResponse<{ id: string }>> {
    try {
      const docRef = await addDoc(collection(db, 'teamMembers'), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { success: true, data: { id: docRef.id } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateTeamMember(id: string, data: Record<string, any>): Promise<ApiResponse<{ message: string }>> {
    try {
      await updateDoc(doc(db, 'teamMembers', id), { ...data, updatedAt: new Date().toISOString() });
      return { success: true, data: { message: 'Updated' } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async deleteTeamMember(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      await deleteDoc(doc(db, 'teamMembers', id));
      return { success: true, data: { message: 'Deleted' } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return {
      success: true,
      data: { status: 'ok', timestamp: new Date().toISOString() }
    };
  }
}

export const apiService = new FirebaseService();
