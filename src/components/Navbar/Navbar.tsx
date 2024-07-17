import { Logo } from './Logo'
import { UserMenu } from './UserMenu'

export const Navbar = () => {
	return (
		<div className="px-8 py-4 bg-red-500 flex justify-between items-center min-h-[72px]">
			<Logo />

			<UserMenu />
		</div>
	)
}
