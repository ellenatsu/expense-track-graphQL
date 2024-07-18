import { Routes, Route } from 'react-router-dom'

import Header from './components/ui/Header'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import TransactionPage from './pages/TransactionPage'
import NotFound from './pages/NotFoundPage'

function App() {
  const authUser = true;
	return (
		<>
      <Header />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={<LoginPage />} /> 
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/transaction' element={<TransactionPage />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</>
	);
}
export default App;
