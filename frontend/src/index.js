import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import store from './store';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ProfileScreen from './screens/ProfileScreen';
import IncomeTracking from './screens/IncomeTracking';
import ExpenseTracking from './screens/ExpenseTracking';
import LoanTracking from './screens/LoanTracking';
import BecomeMember from './screens/BecomeMember';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/Login' element={<LoginScreen />} />
      <Route path='/Register' element={<RegisterScreen />} />
      <Route path='/ForgotPassword' element={<ForgotPasswordScreen />} />
      <Route path='/ResetPassword' element={<ResetPasswordScreen />} />

      {/* Private Routes - Must be logged in to view */}
      <Route path='' element={<PrivateRoute />} >
        <Route path='/incomeTracking' element={<IncomeTracking />} />
        <Route path='/expenseTracking' element={<ExpenseTracking />} />
        <Route path='/loanTracking' element={<LoanTracking />} />
        <Route path='/upgrade' element={<BecomeMember />} />
        <Route path='/Profile' element={<ProfileScreen />} />
        
      </Route>

      {/* <Route path='' element={<AdminRoute />} >
        Add admin only page here
      </Route> */}

    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode> had to remove this because it was causing screens to double render
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router}/>
      </PayPalScriptProvider>
    </Provider>
  /* </React.StrictMode> */
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
