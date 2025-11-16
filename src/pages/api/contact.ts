import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({
          error: 'Content-Type debe ser application/json',
        }),
        { status: 400 }
      )
    }

    const text = await request.text()
    if (!text) {
      return new Response(
        JSON.stringify({
          error: 'Body vacío',
        }),
        { status: 400 }
      )
    }

    const body = JSON.parse(text)
    const { name, email, phone, serviceType, eventDate, message, howFoundUs, acceptPrivacy } = body

    // Validar campos requeridos
    if (!name || !email || !message || !serviceType || !acceptPrivacy) {
      return new Response(
        JSON.stringify({
          error: 'Faltan campos requeridos',
        }),
        { status: 400 }
      )
    }

    // Guardar en Supabase
    const { data: contactMessage, error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        phone,
        service_type: serviceType,
        event_date: eventDate || null,
        message,
        how_found_us: howFoundUs || null,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error saving to database:', dbError)
      return new Response(
        JSON.stringify({
          error: 'Error al guardar el mensaje',
        }),
        { status: 500 }
      )
    }

    // Enviar email con Resend
    try {
      // 1. Email de confirmación al cliente
      const clientEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Gadea Iso <onboarding@brandondev.me>',
          to: [email], // Email del cliente
          subject: '¡Gracias por tu solicitud! - Gadea Iso',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #000; color: white; padding: 30px 20px; text-align: center; }
                  .content { background: #f9f9f9; padding: 30px; }
                  .button { display: inline-block; background: #000; color: white; padding: 12px 30px; text-decoration: none; margin: 20px 0; }
                  .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>GADEA ISO</h1>
                    <p>Fotografía Profesional</p>
                  </div>
                  
                  <div class="content">
                    <h2>¡Hola ${name}!</h2>
                    <p>Gracias por contactarnos. Hemos recibido tu solicitud para <strong>${serviceType}</strong>.</p>
                    
                    <p>Nos pondremos en contacto contigo en las próximas 24 horas para discutir los detalles de tu evento${eventDate ? ` programado para el ${new Date(eventDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}.</p>
                    
                    <p><strong>Resumen de tu solicitud:</strong></p>
                    <ul>
                      <li><strong>Servicio:</strong> ${serviceType}</li>
                      ${eventDate ? `<li><strong>Fecha:</strong> ${new Date(eventDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</li>` : ''}
                      <li><strong>Email:</strong> ${email}</li>
                      ${phone ? `<li><strong>Teléfono:</strong> ${phone}</li>` : ''}
                    </ul>
                    
                    <p><strong>Tu mensaje:</strong></p>
                    <p style="background: white; padding: 15px; border-left: 4px solid #000;">${message}</p>
                    
                    <p>Si tienes alguna pregunta urgente, no dudes en llamarnos al <strong>+506 1234-5678</strong></p>
                    
                    <p>¡Esperamos trabajar contigo pronto!</p>
                    
                    <p style="margin-top: 30px;">
                      Saludos,<br>
                      <strong>Equipo Gadea Iso</strong>
                    </p>
                  </div>
                  
                  <div class="footer">
                    <p>Este es un email automático, por favor no respondas a este mensaje.</p>
                    <p>© 2025 Gadea Iso - Fotografía Profesional</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        }),
      })

      if (!clientEmailResponse.ok) {
        const errorData = await clientEmailResponse.json()
        console.error('Error sending client email:', errorData)
      }

      // 2. Email de notificación al administrador (joel@gadeaiso.com)
      const adminEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Gadea Iso <onboarding@brandondev.me>',
          to: ['brandoncarrilloalvarez2@gmail.com'], // Tu email para recibir notificaciones
          subject: `🔔 Nueva Solicitud: ${serviceType} - ${name}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #000; color: white; padding: 20px; text-align: center; }
                  .content { background: #f9f9f9; padding: 30px; }
                  .field { margin-bottom: 20px; }
                  .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
                  .value { margin-top: 5px; font-size: 16px; background: white; padding: 10px; border-left: 3px solid #000; }
                  .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
                  .urgent { background: #ff9800; color: white; padding: 10px; text-align: center; font-weight: bold; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🔔 NUEVA SOLICITUD</h1>
                    <p>Formulario de Contacto - Gadea Iso</p>
                  </div>
                  
                  ${eventDate && new Date(eventDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? '<div class="urgent">⚠️ EVENTO PRÓXIMO - Contactar pronto</div>' : ''}
                  
                  <div class="content">
                    <div class="field">
                      <div class="label">Nombre Completo</div>
                      <div class="value">${name}</div>
                    </div>
                    
                    <div class="field">
                      <div class="label">Email</div>
                      <div class="value"><a href="mailto:${email}">${email}</a></div>
                    </div>
                    
                    ${phone ? `
                    <div class="field">
                      <div class="label">Teléfono</div>
                      <div class="value"><a href="tel:${phone}">${phone}</a></div>
                    </div>
                    ` : ''}
                    
                    <div class="field">
                      <div class="label">Tipo de Servicio</div>
                      <div class="value">${serviceType}</div>
                    </div>
                    
                    ${eventDate ? `
                    <div class="field">
                      <div class="label">Fecha del Evento</div>
                      <div class="value">${new Date(eventDate).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</div>
                    </div>
                    ` : ''}
                    
                    <div class="field">
                      <div class="label">Mensaje del Cliente</div>
                      <div class="value">${message}</div>
                    </div>
                    
                    ${howFoundUs ? `
                    <div class="field">
                      <div class="label">¿Cómo nos conoció?</div>
                      <div class="value">${howFoundUs}</div>
                    </div>
                    ` : ''}
                    
                    <div style="margin-top: 30px; padding: 20px; background: #e3f2fd; border-left: 4px solid #2196f3;">
                      <strong>💡 Acciones sugeridas:</strong>
                      <ul>
                        <li>Responder al cliente en las próximas 24 horas</li>
                        <li>Verificar disponibilidad para la fecha solicitada</li>
                        <li>Preparar cotización según el servicio</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div class="footer">
                    <p>📧 Este mensaje fue enviado desde el formulario de contacto de gadeaiso.com</p>
                    <p>🕐 Recibido: ${new Date().toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })}</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        }),
      })

      if (!adminEmailResponse.ok) {
        const errorData = await adminEmailResponse.json()
        console.error('Error sending admin email:', errorData)
      }
    } catch (emailError) {
      console.error('Error with Resend API:', emailError)
      // No retornamos error porque el mensaje ya se guardó en la DB
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mensaje enviado correctamente',
        data: contactMessage,
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return new Response(
      JSON.stringify({
        error: 'Error al procesar la solicitud',
      }),
      { status: 500 }
    )
  }
}
