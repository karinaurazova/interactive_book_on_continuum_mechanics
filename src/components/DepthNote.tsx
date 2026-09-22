import type { ReactNode } from 'react'

type Props = {
  label: string
  variant?: 'advanced' | 'research'
  children: ReactNode
}

export function DepthNote({label,variant='advanced',children}:Props){
  return (
    <details className={`depth-note depth-note-${variant}`}>
      <summary>
        <span>{variant==='research' ? '◇' : '+'}</span>
        {label}
      </summary>
      <div className="depth-note-body">{children}</div>
    </details>
  )
}
