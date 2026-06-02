const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function buildEmailHtml(booking: Record<string, string>, cancellationLink: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #412b35; line-height: 1.5;">
      <h1>Your appointment is confirmed!</h1>
      <p>Thanks for booking with <strong>Doodles & Friends by Manny</strong>.</p>
      <h2>Appointment Details</h2>
      <ul>
        <li><strong>Owner:</strong> ${booking.owner_name}</li>
        <li><strong>Dog:</strong> ${booking.dog_name}</li>
        <li><strong>Breed:</strong> ${booking.dog_breed || 'Not provided'}</li>
        <li><strong>Service:</strong> ${booking.service_type}</li>
        <li><strong>Date:</strong> ${booking.appointment_date}</li>
        <li><strong>Time:</strong> ${booking.appointment_time}</li>
      </ul>
      <p>Manny will contact you if any details are needed.</p>
      <p>
        Need to cancel? Use this secure link:<br />
        <a href="${cancellationLink}">${cancellationLink}</a>
      </p>
    </div>
  `
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong.'
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail = Deno.env.get('BOOKING_FROM_EMAIL')

    if (!resendApiKey || !fromEmail) {
      throw new Error('Email service is not configured.')
    }

    const { booking, cancellationLink } = await request.json()

    if (!booking?.email || !cancellationLink) {
      throw new Error('Booking email and cancellation link are required.')
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: booking.email,
        subject: `Confirmed: ${booking.dog_name}'s grooming appointment`,
        html: buildEmailHtml(booking, cancellationLink),
      }),
    })

    if (!response.ok) {
      const resendError = await response.text()
      throw new Error(`Unable to send confirmation email. ${resendError}`)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
