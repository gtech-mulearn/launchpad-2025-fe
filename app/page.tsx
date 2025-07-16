import { MagicalCursor } from "@/components/magical-cursor"
import LoginPage from "./login/page"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-secondary-900">
      <MagicalCursor />
      <LoginPage />
    </div>
  )
}
