import { requireSupabase } from './supabase'

export async function createContactMessage(message) {
  const client = requireSupabase()
  const { error } = await client.from('contact_messages').insert(message)

  if (error) {
    throw new Error('Unable to send your message. Please try again.')
  }
}

export async function fetchAdminContactMessages() {
  const client = requireSupabase()
  const { data, error } = await client
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Unable to load inquiries.')
  }

  return data
}

export async function updateContactMessageStatus(id, status) {
  const client = requireSupabase()
  const { error } = await client.from('contact_messages').update({ status }).eq('id', id)

  if (error) {
    throw new Error('Unable to update inquiry.')
  }
}

export async function deleteContactMessage(id) {
  const client = requireSupabase()
  const { error } = await client.from('contact_messages').delete().eq('id', id)

  if (error) {
    throw new Error('Unable to delete inquiry.')
  }
}
