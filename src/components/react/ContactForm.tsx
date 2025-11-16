import { useState } from 'react'

interface FormData {
  name: string
  email: string
  phone: string
  serviceType: string
  eventDate: string
  message: string
  howFoundUs: string
  acceptPrivacy: boolean
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    eventDate: '',
    message: '',
    howFoundUs: '',
    acceptPrivacy: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const serviceTypes = [
    'Bodas',
    'Cumpleaños',
    'Eventos Corporativos',
    'Fotografía Comercial',
    'Sesión de Fotos',
    'Otro',
  ]

  const howFoundUsOptions = [
    'Google',
    'Instagram',
    'Facebook',
    'Recomendación',
    'Sitio Web',
    'Otro',
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: '¡Mensaje enviado! Te contactaremos pronto.',
        })
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceType: '',
          eventDate: '',
          message: '',
          howFoundUs: '',
          acceptPrivacy: false,
        })
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Error al enviar el mensaje. Intenta de nuevo.',
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Error de conexión. Por favor intenta de nuevo.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#0a0a0a] border-2 border-[#000000] dark:border-white rounded-3xl p-8 md:p-10"
    >
      {/* Nombre Completo */}
      <div className="mb-6">
        <label
          htmlFor="name"
          className="block text-xs font-semibold text-[#666666] dark:text-gray-400 uppercase tracking-wider mb-2"
        >
          Nombre Completo *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Juan Pérez"
          className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-[#e0e0e0] dark:border-gray-700 rounded-lg text-[#000000] dark:text-white placeholder-[#999999] focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors"
        />
      </div>

      {/* Email y Teléfono */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-[#666666] dark:text-gray-400 uppercase tracking-wider mb-2"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="juan@ejemplo.com"
            className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-[#e0e0e0] dark:border-gray-700 rounded-lg text-[#000000] dark:text-white placeholder-[#999999] focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-semibold text-[#666666] dark:text-gray-400 uppercase tracking-wider mb-2"
          >
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+506 1234 5678"
            className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-[#e0e0e0] dark:border-gray-700 rounded-lg text-[#000000] dark:text-white placeholder-[#999999] focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors"
          />
        </div>
      </div>

      {/* Tipo de Servicio */}
      <div className="mb-6">
        <label
          htmlFor="serviceType"
          className="block text-xs font-semibold text-[#666666] dark:text-gray-400 uppercase tracking-wider mb-2"
        >
          Tipo de Servicio *
        </label>
        <select
          id="serviceType"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-[#e0e0e0] dark:border-gray-700 rounded-lg text-[#000000] dark:text-white focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23999' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">Seleccionar</option>
          {serviceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha del Evento */}
      <div className="mb-6">
        <label
          htmlFor="eventDate"
          className="block text-xs font-semibold text-[#666666] dark:text-gray-400 uppercase tracking-wider mb-2"
        >
          Fecha del Evento
        </label>
        <input
          type="date"
          id="eventDate"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-[#e0e0e0] dark:border-gray-700 rounded-lg text-[#000000] dark:text-white focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors"
        />
      </div>

      {/* Mensaje */}
      <div className="mb-6">
        <label
          htmlFor="message"
          className="block text-xs font-semibold text-[#666666] dark:text-gray-400 uppercase tracking-wider mb-2"
        >
          Cuéntanos sobre tu evento *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          maxLength={500}
          placeholder="Queremos fotos de..."
          className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-[#e0e0e0] dark:border-gray-700 rounded-lg text-[#000000] dark:text-white placeholder-[#999999] focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors resize-none"
        ></textarea>
        <div className="text-right text-xs text-[#999999] dark:text-gray-500 mt-1">
          {formData.message.length}/500
        </div>
      </div>

      {/* ¿Cómo nos conociste? */}
      <div className="mb-6">
        <label
          htmlFor="howFoundUs"
          className="block text-xs font-semibold text-[#666666] dark:text-gray-400 uppercase tracking-wider mb-2"
        >
          ¿Cómo nos conociste?
        </label>
        <select
          id="howFoundUs"
          name="howFoundUs"
          value={formData.howFoundUs}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-[#e0e0e0] dark:border-gray-700 rounded-lg text-[#000000] dark:text-white focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23999' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">Seleccionar</option>
          {howFoundUsOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Checkbox de privacidad */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="acceptPrivacy"
            checked={formData.acceptPrivacy}
            onChange={handleChange}
            required
            className="mt-1 w-4 h-4 border-2 border-[#cccccc] rounded checked:bg-[#000000] checked:border-[#000000] dark:checked:bg-white dark:checked:border-white focus:ring-0 cursor-pointer"
          />
          <span className="text-xs text-[#666666] dark:text-gray-400">
            Acepto la política de privacidad y el tratamiento de mis datos personales
          </span>
        </label>
      </div>

      {/* Status Message */}
      {submitStatus.type && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isSubmitting || !formData.acceptPrivacy}
        className="w-full bg-[#000000] dark:bg-white text-white dark:text-[#000000] font-semibold py-4 rounded-lg uppercase tracking-wider transition-all duration-300 hover:bg-[#333333] dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Solicitud →'}
      </button>

      {/* Footer de seguridad */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[#999999] dark:text-gray-500">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Datos Seguros</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span>Respuesta en 24h</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Sin Compromiso</span>
        </div>
      </div>

      {/* Llamada alternativa */}
      <div className="mt-6 text-center">
        <p className="text-xs text-[#999999] dark:text-gray-500 mb-2">¿Prefieres llamar?</p>
        <a
          href="tel:+50612345678"
          className="inline-flex items-center gap-2 text-sm text-[#000000] dark:text-white font-semibold hover:underline"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          +506 1234-5678
        </a>
      </div>
    </form>
  )
}
