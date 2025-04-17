import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

type ButtonProps = {
  title: string
  type?: 'button' | 'reset' | 'submit'
  disabled?: boolean
  className?: string
  bgClassName: string
  isLoading?: boolean
  onClick?: () => void
}

const Button = ({
  title,
  type = 'button',
  className,
  bgClassName,
  disabled = false,
  isLoading,
  onClick,
}: ButtonProps) => {
  const disabledClass = bgClassName
    ? `${bgClassName.replace('500', '200')} cursor-not-allowed`
    : 'bg-gray-300 cursor-not-allowed'

  return (
    <button
      type={type}
      className={cn(
        'flex h-[36px] w-fit items-center rounded-[10px] px-4 py-2 text-center hover:cursor-pointer',
        disabled ? disabledClass : bgClassName,
        className,
      )}
      onClick={onClick}
      disabled={disabled}>
      {isLoading && <Loader2 className="animate-spin" />}
      {title}
    </button>
  )
}

export default Button
