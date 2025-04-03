import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PromptTemplateProps {
  title: string
  description: string
  onClick: () => void
}

export function PromptTemplate({ title, description, onClick }: PromptTemplateProps) {
  return (
    <Card 
      className="cursor-pointer hover:border-blue-400 transition-colors"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}