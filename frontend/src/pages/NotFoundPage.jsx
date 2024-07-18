const NotFound = () => {
	return (
		<section>
			<div className=' text-white'>
				<div className='flex h-screen'>
					<div className='m-auto text-center'>
						<div>
							<img src='/404-error.png' alt='404' />
						</div>
						<p className='text-sm md:text-base text-[#00cdf6] p-2 mb-4'>
							The stuff you were looking for doesn't exist
						</p>
						<a
							href='/'
							className='bg-transparent text-blue-400 hover:text-white rounded shadow hover:shadow-lg py-2 px-4 border border-[#005af6] hover:border-transparent'
						>
							Take me home
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};
export default NotFound;