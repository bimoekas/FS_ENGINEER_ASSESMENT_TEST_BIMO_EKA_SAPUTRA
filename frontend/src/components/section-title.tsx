import { cn } from '@/lib/utils'

const SectionTitle = ({
  title,
  className,
}: {
  title: string
  className?: string
}) => {
  return <p className={cn(className, 'text-5xl')}>{title}</p>
}

export default SectionTitle
