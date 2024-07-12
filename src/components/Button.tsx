import type { ButtonHTMLAttributes } from 'react'

export const Button = ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			{...props}
			className="px-4 py-2 border border-gray-300 rounded-md transition-all bg-white hover:bg-slate-100 disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500"
		>
			{children}
		</button>
	)
}
