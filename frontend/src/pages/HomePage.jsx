import { useMutation } from "@apollo/client";
import { Doughnut } from "react-chartjs-2";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";
import { LOGOUT } from "../graphql/mutations/user.mutation";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user.query";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {

	//for logout
	const [logout, {loading}] = useMutation(LOGOUT,{
		refetchQueries: [GET_AUTHENTICATED_USER],
	  });
	
	const handleLogout = async () => {
		try{
			await logout();
			//TODO:clear the apollo client cache

			toast.success("logged out successfully");
		}catch(error){
			console.error("Error logging out user: ", error);
			toast.error(error.message || "Internal server error");
		}
	};

	const chartData = {
		labels: ["Saving", "Expense", "Investment"],
		datasets: [
			{
				label: "%",
				data: [13, 8, 3],
				backgroundColor: ["rgba(75, 192, 192)", "rgba(200, 200, 200)", "rgba(54, 162, 235)"],
				borderColor: ["rgba(75, 192, 192)", "rgba(200, 200, 200)", "rgba(54, 162, 235, 1)"],
				borderWidth: 1,
				borderRadius: 30,
				spacing: 10,
				cutout: 130,
			},
		],
	};


	return (
		<>
			<div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center'>
				<div className='flex items-center'>
					<p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-gray-200 via-gray-600 to-gray-400 inline-block text-transparent bg-clip-text'>
						Hello, username, profileImg
					</p>
					<img
						src={"https://tecdn.b-cdn.net/img/new/avatars/2.webp"}
						className='w-11 h-11 rounded-full border cursor-pointer'
						alt='Avatar'
					/>
					{!loading && <MdLogout className='mx-2 w-5 h-5 cursor-pointer' onClick={handleLogout} />}
					{/* loading spinner */}
					{loading && <div className='w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin'></div>}
				</div>
				<div className='flex flex-wrap w-full justify-center items-center gap-6'>
					<div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]  '>
						<Doughnut data={chartData} />
					</div>

					<TransactionForm />
				</div>
				<Cards />
			</div>
		</>
	);
};
export default HomePage;