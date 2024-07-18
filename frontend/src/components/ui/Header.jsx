import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className='mb-10'>
			<h1 className='md:text-6xl text-4xl lg:text-8xl font-bold text-center  relative z-50 text-white pt-10'>
				Expense <Link to='/'>Tracker</Link>
			</h1>

		</div>
	);
};
export default Header;