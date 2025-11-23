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
                  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                  .header { background: #000000; padding: 40px 20px; text-align: center; }
                  .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; font-weight: 300; text-transform: uppercase; }
                  .content { padding: 40px 30px; }
                  .greeting { font-size: 18px; margin-bottom: 20px; }
                  .summary-box { background: #f9f9f9; padding: 20px; margin: 30px 0; border-left: 4px solid #000000; }
                  .summary-item { margin-bottom: 10px; }
                  .summary-label { font-weight: bold; font-size: 12px; text-transform: uppercase; color: #666; display: block; margin-bottom: 4px; }
                  .summary-value { font-size: 16px; color: #000; }
                  .message-box { margin-top: 30px; }
                  .footer { background: #f5f5f5; padding: 30px; text-align: center; font-size: 12px; color: #888; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Gadea Iso</h1>
                  </div>
                  
                  <div class="content">
                    <div class="greeting">Hola ${name},</div>
                    
                    <p>Gracias por ponerte en contacto con nosotros. Hemos recibido correctamente tu solicitud para el servicio de <strong>${serviceType}</strong>.</p>
                    
                    <p>Nuestro equipo revisará tu información y nos pondremos en contacto contigo en un plazo máximo de 24 horas para conversar sobre los detalles de tu evento.</p>
                    
                    <div class="summary-box">
                      <div class="summary-item">
                        <span class="summary-label">Servicio Solicitado</span>
                        <div class="summary-value">${serviceType}</div>
                      </div>
                      
                      ${eventDate ? `
                      <div class="summary-item">
                        <span class="summary-label">Fecha del Evento</span>
                        <div class="summary-value">${new Date(eventDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      </div>
                      ` : ''}
                      
                      <div class="summary-item">
                        <span class="summary-label">Email de Contacto</span>
                        <div class="summary-value">${email}</div>
                      </div>
                      
                      ${phone ? `
                      <div class="summary-item">
                        <span class="summary-label">Teléfono</span>
                        <div class="summary-value">${phone}</div>
                      </div>
                      ` : ''}
                    </div>
                    
                    <div class="message-box">
                      <p><strong>Tu mensaje:</strong></p>
                      <p style="color: #555; font-style: italic;">"${message}"</p>
                    </div>
                    
                    <p style="margin-top: 40px;">
                      Atentamente,<br>
                      <strong>Equipo Gadea Iso</strong>
                    </p>
                  </div>
                  
                  <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Gadea Iso. Todos los derechos reservados.</p>
                    <p>Este es un correo automático, por favor no responder directamente a esta dirección.</p>
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
                  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
                  .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                  .header { background: #000000; padding: 40px 20px; text-align: center; }
                  .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 500; letter-spacing: 1px; }
                  .meta { color: #888888; font-size: 12px; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; }
                  .content { padding: 40px 30px; text-align: left; }
                  .section { margin-bottom: 30px; }
                  .label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 8px; font-weight: 600; }
                  .value { font-size: 16px; color: #000; font-weight: 400; }
                  .value a { color: #000; text-decoration: none; border-bottom: 1px dotted #999; }
                  .message-block { background: #f9f9f9; padding: 25px; border-radius: 4px; margin-top: 10px; text-align: left; font-size: 15px; color: #444; }
                  .urgent-badge { background: #000; color: #fff; display: inline-block; padding: 6px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; margin-bottom: 30px; }
                  .footer { background: #f9f9f9; padding: 20px; font-size: 11px; color: #aaa; text-align: center; border-top: 1px solid #eee; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Nueva Solicitud</h1>
                    <div class="meta">${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  
                  <div class="content">
                    ${eventDate && new Date(eventDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? '<div class="urgent-badge">Evento Próximo</div>' : ''}
                    
                    <div class="section">
                      <div class="label">Cliente</div>
                      <div class="value">${name}</div>
                    </div>
                    
                    <div class="section">
                      <div class="label">Contacto</div>
                      <div class="value">
                        <a href="mailto:${email}">${email}</a>
                        ${phone ? `<br><div style="margin-top:5px"><a href="tel:${phone}">${phone}</a></div>` : ''}
                      </div>
                    </div>
                    
                    <div class="section">
                      <div class="label">Servicio Solicitado</div>
                      <div class="value">
                        ${serviceType}
                        ${eventDate ? `<div style="font-size: 14px; color: #666; margin-top: 5px;">${new Date(eventDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>` : ''}
                      </div>
                    </div>
                    
                    ${howFoundUs ? `
                    <div class="section">
                      <div class="label">Fuente</div>
                      <div class="value" style="font-size: 16px;">${howFoundUs}</div>
                    </div>
                    ` : ''}
                    
                    <div class="section" style="margin-top: 40px;">
                      <div class="label">Mensaje del Cliente</div>
                      <div class="message-block">
                        "${message}"
                      </div>
                    </div>
                  </div>
                  
                  <div class="footer">
                    Sistema de Notificaciones Gadea Iso &bull; ID: ${contactMessage?.id || 'N/A'}
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
