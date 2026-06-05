export const metadata = {
  title: 'Campus Notifications',
  description: 'Campus Notifications Priority Inbox',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}