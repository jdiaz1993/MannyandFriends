import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase admin credentials are not configured.')
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong.'
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, token } = await request.json()

    if (!token) {
      throw new Error('Cancellation token is required.')
    }

    const supabase = getSupabaseAdmin()
    const { data: booking, error: lookupError } = await supabase
      .from('bookings')
      .select(
        'id, owner_name, dog_name, dog_breed, service_type, appointment_date, appointment_time, status',
      )
      .eq('cancellation_token', token)
      .maybeSingle()

    if (lookupError || !booking) {
      throw new Error('Appointment not found.')
    }

    if (action === 'lookup') {
      return new Response(JSON.stringify({ booking }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action !== 'cancel') {
      throw new Error('Unsupported cancellation action.')
    }

    if (booking.status === 'cancelled') {
      return new Response(JSON.stringify({ booking }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: cancelledBooking, error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', booking.id)
      .select(
        'id, owner_name, dog_name, dog_breed, service_type, appointment_date, appointment_time, status',
      )
      .single()

    if (updateError) {
      throw new Error('Unable to cancel appointment.')
    }

    return new Response(JSON.stringify({ booking: cancelledBooking }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
