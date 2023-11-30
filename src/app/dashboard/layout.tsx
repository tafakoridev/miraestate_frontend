import './dashboard.css'

export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <section className={`h-full w-full bg-white`}>{children}</section>
  }