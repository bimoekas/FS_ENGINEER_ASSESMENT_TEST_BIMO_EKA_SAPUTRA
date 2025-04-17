import { useEffect } from 'react'

import { cn } from '@/lib/utils'
import { AlertMessage } from '@/types/entities/alert-message'

type AlertProps = {
  alertMessage: AlertMessage
  setAlertMessage: ({ message, show, type }: AlertMessage) => void
}

const Alert = ({ alertMessage, setAlertMessage }: AlertProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlertMessage({ show: false, message: '', type: null })
    }, 3000)

    return () => clearTimeout(timer)
  }, [alertMessage.show, setAlertMessage])

  if (!alertMessage.show) return null

  return (
    <div className="fixed right-4 bottom-4 z-50 px-4">
      <div
        className={cn(
          'rounded-md px-4 py-2',
          alertMessage.type === 'success'
            ? 'bg-green-300 text-green-800'
            : 'bg-red-300 text-red-800',
        )}>
        {alertMessage.message}
      </div>
    </div>
  )
}

export default Alert
