import { create } from 'zustand'
import { Contact } from '@/api/contacts'

interface ContactsState {
  contacts: Contact[]
  isLoading: boolean
  setContacts: (contacts: Contact[]) => void
  addContact: (contact: Contact) => void
  updateContact: (contact: Contact) => void
  deleteContact: (id: number) => void
  setLoading: (loading: boolean) => void
  clearContacts: () => void
}

export const useContactsStore = create<ContactsState>((set) => ({
  contacts: [],
  isLoading: false,

  setContacts: (contacts) => set({ contacts }),
  
  addContact: (contact) =>
    set((state) => ({ contacts: [contact, ...state.contacts] })),
  
  updateContact: (updatedContact) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === updatedContact.id ? updatedContact : c
      ),
    })),
  
  deleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  clearContacts: () => set({ contacts: [] }),
}))
