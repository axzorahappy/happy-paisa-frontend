import React from 'react'

interface SectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export const Section: React.FC<SectionProps> = ({ title, children, className = '' }) => {
  return (
    <section className={`mb-6 ${className}`}>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">
          {title}
        </h2>
        <div className="text-white/90">
          {children}
        </div>
      </div>
    </section>
  )
}

export default Section