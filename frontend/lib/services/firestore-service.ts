import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db, isConfigured } from '@/lib/firebase/config';
import { v4 as uuidv4 } from 'uuid';
import type {
  AppEvent,
  Task,
  Expense,
  Guest,
  RegistryItem,
  CreateEventInput,
  CreateTaskInput,
  CreateExpenseInput,
  CreateGuestInput,
  CreateRegistryItemInput,
} from '@/lib/types';

export class FirestoreService {
  private static checkFirestore() {
    if (!isConfigured || !db) {
      throw new Error('Firebase Firestore not configured');
    }
  }

  // Events
  static async createEvent(
    userId: string,
    input: CreateEventInput
  ): Promise<string> {
    this.checkFirestore();
    const eventId = uuidv4();
    const eventRef = doc(db!, 'events', eventId);

    const eventData: AppEvent = {
      id: eventId,
      hostUserId: userId,
      name: input.name,
      date: Timestamp.fromDate(input.date),
      theme: input.theme,
      budgetTotal: input.budgetTotal,
      inviteToken: uuidv4(),
      createdAt: Timestamp.now(),
    };

    await import('firebase/firestore').then(({ setDoc }) =>
      setDoc(eventRef, eventData)
    );

    // Add default tasks
    await this.createTask(eventId, { eventId: eventId, title: 'Send Invitations' });
    await this.createTask(eventId, { eventId: eventId, title: 'Book Venue' });
    await this.createTask(eventId, { eventId: eventId, title: 'Order Cake' });

    return eventId;
  }

  static subscribeToEvents(
    userId: string,
    callback: (events: AppEvent[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db!, 'events'),
      where('hostUserId', '==', userId),
      orderBy('date', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map((doc) => doc.data() as AppEvent);
      callback(events);
    });
  }

  static async getEvent(eventId: string): Promise<AppEvent | null> {
    const eventRef = doc(db!, 'events', eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      return null;
    }

    return eventSnap.data() as AppEvent;
  }

  static async updateEvent(
    eventId: string,
    updates: Partial<AppEvent>
  ): Promise<void> {
    const eventRef = doc(db!, 'events', eventId);
    await updateDoc(eventRef, updates);
  }

  static async deleteEvent(eventId: string): Promise<void> {
    const eventRef = doc(db!, 'events', eventId);
    await deleteDoc(eventRef);
  }

  // Tasks
  static async createTask(
    eventId: string,
    input: CreateTaskInput
  ): Promise<string> {
    const taskId = uuidv4();
    const taskRef = doc(db!, 'events', eventId, 'tasks', taskId);

    const taskData: any = {
      id: taskId,
      eventId,
      title: input.title,
      isCompleted: false,
      createdAt: Timestamp.now(),
    };

    // Only add dueDate if it's provided
    if (input.dueDate) {
      taskData.dueDate = Timestamp.fromDate(input.dueDate);
    }

    await import('firebase/firestore').then(({ setDoc }) =>
      setDoc(taskRef, taskData)
    );

    return taskId;
  }

  static subscribeToTasks(
    eventId: string,
    callback: (tasks: Task[]) => void
  ): Unsubscribe {
    const tasksRef = collection(db!, 'events', eventId, 'tasks');

    return onSnapshot(tasksRef, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => doc.data() as Task);
      callback(tasks.sort((a, b) => a.title.localeCompare(b.title)));
    });
  }

  static async toggleTask(eventId: string, taskId: string): Promise<void> {
    const taskRef = doc(db!, 'events', eventId, 'tasks', taskId);
    const taskSnap = await getDoc(taskRef);

    if (taskSnap.exists()) {
      const task = taskSnap.data() as Task;
      await updateDoc(taskRef, { completed: !task.completed });
    }
  }

  static async deleteTask(eventId: string, taskId: string): Promise<void> {
    const taskRef = doc(db!, 'events', eventId, 'tasks', taskId);
    await deleteDoc(taskRef);
  }

  // Expenses
  static async createExpense(
    eventId: string,
    input: CreateExpenseInput
  ): Promise<string> {
    const expenseId = uuidv4();
    const expenseRef = doc(db!, 'events', eventId, 'expenses', expenseId);

    const expenseData: any = {
      id: expenseId,
      eventId,
      description: input.description,
      category: input.category,
      amount: input.amount
    };

    await import('firebase/firestore').then(({ setDoc }) =>
      setDoc(expenseRef, expenseData)
    );

    return expenseId;
  }

  static subscribeToExpenses(
    eventId: string,
    callback: (expenses: Expense[]) => void
  ): Unsubscribe {
    const expensesRef = collection(db!, 'events', eventId, 'expenses');

    return onSnapshot(expensesRef, (snapshot) => {
      const expenses = snapshot.docs.map((doc) => doc.data() as Expense);
      callback(expenses);
    });
  }

  static async deleteExpense(
    eventId: string,
    expenseId: string
  ): Promise<void> {
    const expenseRef = doc(db!, 'events', eventId, 'expenses', expenseId);
    await deleteDoc(expenseRef);
  }

  // Guests
  static async createGuest(
    eventId: string,
    input: CreateGuestInput
  ): Promise<string> {
    const guestId = uuidv4();
    const guestRef = doc(db!, 'guests', guestId);

    const guestData: any = {
      id: guestId,
      eventId,
      name: input.name,
      status: 'invited',
      createdAt: Timestamp.now(),
    };

    // Only add optional fields if provided
    if (input.email) {
      guestData.email = input.email;
    }
    if (input.note) {
      guestData.note = input.note;
    }

    await import('firebase/firestore').then(({ setDoc }) =>
      setDoc(guestRef, guestData)
    );

    return guestId;
  }

  static subscribeToGuests(
    eventId: string,
    callback: (guests: Guest[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db!, 'guests'),
      where('eventId', '==', eventId)
    );

    return onSnapshot(q, (snapshot) => {
      const guests = snapshot.docs.map((doc) => doc.data() as Guest);
      callback(guests.sort((a, b) => a.name.localeCompare(b.name)));
    });
  }

  static async updateGuestStatus(
    guestId: string,
    status: Guest['status']
  ): Promise<void> {
    const guestRef = doc(db!, 'guests', guestId);
    await updateDoc(guestRef, { status });
  }

  static async deleteGuest(guestId: string): Promise<void> {
    const guestRef = doc(db!, 'guests', guestId);
    await deleteDoc(guestRef);
  }

  // Registry Items
  static async createRegistryItem(
    eventId: string,
    input: CreateRegistryItemInput
  ): Promise<string> {
    const itemId = uuidv4();
    const itemRef = doc(db!, 'events', eventId, 'registry_items', itemId);

    const itemData: any = {
      id: itemId,
      eventId,
      name: input.name,
      url: input.url,
      storeName: input.storeName,
    };

    // Only add optional fields if provided

    await import('firebase/firestore').then(({ setDoc }) =>
      setDoc(itemRef, itemData)
    );

    return itemId;
  }

  static subscribeToRegistryItems(
    eventId: string,
    callback: (items: RegistryItem[]) => void
  ): Unsubscribe {
    const itemsRef = collection(db!, 'events', eventId, 'registry_items');

    return onSnapshot(itemsRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => doc.data() as RegistryItem);
      callback(items.sort((a, b) => a.name.localeCompare(b.name)));
    });
  }

  static async claimRegistryItem(
    eventId: string,
    itemId: string,
    guestId: string,
    guestName: string
  ): Promise<void> {
    const itemRef = doc(db!, 'events', eventId, 'registry_items', itemId);
    await updateDoc(itemRef, {
      isClaimed: true,
      claimedBy: guestId,
      claimedByName: guestName,
    });
  }

  static async unclaimRegistryItem(
    eventId: string,
    itemId: string
  ): Promise<void> {
    const itemRef = doc(db!, 'events', eventId, 'registry_items', itemId);
    await updateDoc(itemRef, {
      isClaimed: false,
      claimedBy: deleteField(),
      claimedByName: deleteField(),
    });
  }

  static async deleteRegistryItem(
    eventId: string,
    itemId: string
  ): Promise<void> {
    const itemRef = doc(db!, 'events', eventId, 'registry_items', itemId);
    await deleteDoc(itemRef);
  }
}

