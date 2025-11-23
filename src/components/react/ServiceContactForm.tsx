
import { useState, useEffect } from 'react'

interface ServiceContactFormProps {
    serviceName: string
}

interface FormData {
    name: string
    email: string
    phone: string
    serviceType: string
    eventDate: string
    message: string
    howFoundUs: string
}

export default function ServiceContactForm({ serviceName }: ServiceContactFormProps) {
    const [formData, setFormData] = useState<FormData & { acceptPrivacy: boolean }>({
        name: '',
        email: '',
        phone: '',
        serviceType: serviceName,
        eventDate: '',
        message: '',
        howFoundUs: '',
        acceptPrivacy: false,
    })

    const howFoundUsOptions = [
        'Google',
        'Instagram',
        'Facebook',
        'Recomendación',
        'Sitio Web',
        'Otro',
    ]

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null
        message: string
    }>({ type: null, message: '' })


    useEffect(() => {
        setFormData(prev => ({ ...prev, serviceType: serviceName }))
    }, [serviceName])

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
                body: JSON.stringify({
                    ...formData,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setSubmitStatus({
                    type: 'success',
                    message: '¡Solicitud enviada con éxito!',
                })
                // Reset form but keep service type
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    serviceType: serviceName,
                    eventDate: '',
                    message: '',
                    howFoundUs: '',
                    acceptPrivacy: false,
                })
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: data.error || 'Error al enviar.',
                })
            }
        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'Error de conexión.',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre Completo */}
            <div>
                <label htmlFor="name" className="block text-xs font-medium text-[#000000] dark:text-white mb-1.5 uppercase tracking-wide">
                    Nombre completo
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-[#000000]/20 dark:border-white/20 rounded-md text-sm text-[#000000] dark:text-white focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors"
                    placeholder="Tu nombre"
                />
            </div>

            {/* Grid 2 columnas para Email y Teléfono */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-[#000000] dark:text-white mb-1.5 uppercase tracking-wide">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-[#000000]/20 dark:border-white/20 rounded-md text-sm text-[#000000] dark:text-white focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors"
                        placeholder="tu@email.com"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-[#000000] dark:text-white mb-1.5 uppercase tracking-wide">
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-[#000000]/20 dark:border-white/20 rounded-md text-sm text-[#000000] dark:text-white focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors"
                        placeholder="+506..."
                    />
                </div>
            </div>

            {/* Fecha del Evento */}
            <div>
                <label htmlFor="eventDate" className="block text-xs font-medium text-[#000000] dark:text-white mb-1.5 uppercase tracking-wide">
                    Fecha del evento
                </label>
                <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-[#000000]/20 dark:border-white/20 rounded-md text-sm text-[#000000] dark:text-white focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors"
                />
            </div>

            {/* Mensaje */}
            <div>
                <label htmlFor="message" className="block text-xs font-medium text-[#000000] dark:text-white mb-1.5 uppercase tracking-wide">
                    Mensaje
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-[#000000]/20 dark:border-white/20 rounded-md text-sm text-[#000000] dark:text-white focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors resize-none"
                    placeholder="Cuéntanos más..."
                ></textarea>
            </div>

            {/* ¿Cómo nos conociste? */}
            <div>
                <label htmlFor="howFoundUs" className="block text-xs font-medium text-[#000000] dark:text-white mb-1.5 uppercase tracking-wide">
                    ¿Cómo nos conociste?
                </label>
                <select
                    id="howFoundUs"
                    name="howFoundUs"
                    value={formData.howFoundUs}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white dark:bg-[#0a0a0a] border border-[#000000]/20 dark:border-white/20 rounded-md text-sm text-[#000000] dark:text-white focus:outline-none focus:border-[#000000] dark:focus:border-white transition-colors appearance-none cursor-pointer"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23999' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.2em 1.2em',
                        paddingRight: '2rem',
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
            <div>
                <label className="flex items-start gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onChange={handleChange}
                        required
                        className="mt-0.5 w-3.5 h-3.5 border border-[#000000]/20 dark:border-white/20 rounded checked:bg-[#000000] checked:border-[#000000] dark:checked:bg-white dark:checked:border-white focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[10px] text-[#666666] dark:text-gray-400 leading-tight">
                        Acepto la política de privacidad
                    </span>
                </label>
            </div>

            {/* Status Message */}
            {submitStatus.type && (
                <div
                    className={`p-3 rounded-md text-xs font-medium ${submitStatus.type === 'success'
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
                className="w-full px-6 py-3 bg-[#000000] dark:bg-white text-white dark:text-[#000000] font-medium text-sm rounded-md uppercase tracking-wider transition-all duration-300 hover:bg-[#333333] dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Enviando...' : 'Solicitar Información'}
            </button>
        </form>
    )
}
