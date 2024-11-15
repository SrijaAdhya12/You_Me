import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ClerkProvider, SignInButton, SignedOut, UserButton, SignedIn } from '@clerk/nextjs'
import { Navbar } from '../components'
import ClientProvider from './ClientProvider'
const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
})

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					<ClientProvider>
						<Navbar />
						<main className="mx-w-5xl mx-auto px-3 py-6">{children}</main>
					</ClientProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
