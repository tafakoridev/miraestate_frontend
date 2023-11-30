export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <section className={`h-full flex justify-center items-center bg-gradient-to-r from-blue-900 to-white`}>{children}</section>
  }