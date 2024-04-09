import { useContext } from 'react';
import './App.css'
import { AuthContext } from './context/AuthContext';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/NavBar';
import Menu from './components/Menu';
import Landingpage from './components/Landingpage';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Transaction from './components/Transaction';
import AddIncome from './components/AddIncome';
import AddExpense from './components/AddExpense';
import AddBudget from './components/AddBudget';
import Budget from './components/Budget';
import Report from './components/Report';
import Scan from './scanreceipts/Scan';
import Client from './plaid/Client';


function App() {
  const { token } = useContext(AuthContext);

  return (
    <div className="App">
        {token ? (
        <div>
          <Navbar />

              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reports" element={<Report />} />
                <Route path="/transactions" element={<Transaction />} />
                <Route path="/addexpense" element={<AddExpense />} />
                <Route path="/addincome" element={<AddIncome />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/addbudget" element={<AddBudget />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/link" element={<Client />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>

            <Menu />
        </div>
        ) : (
          <Routes>
            <Route path="/" element={<Landingpage />} />
            {/* <Route path="/entrypage" element={<LandingPage2 />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
      )}
    
    </div>
  )
}

export default App

