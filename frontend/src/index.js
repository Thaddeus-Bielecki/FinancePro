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
import ProfileScreen from './screens/ProfileScreen';
import IncomeExpenseTracking from './screens/IncomeExpenseTracking';
import BecomeMember from './screens/BecomeMember';
import FAQScreen from './screens/FAQScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      {/* <Route path='/IETracking' element={<IncomeExpenseTracking />} /> */}
      {/* <Route path='/upgrade' element={<BecomeMember />} /> */}
      <Route path='/Login' element={<LoginScreen />} />
      <Route path='/Register' element={<RegisterScreen />} />
      {/* <Route path='/Payment' element={<PaymentScreen />} /> */}
      {/* <Route path='/Profile' element={<ProfileScreen />} /> */}
      
      <Route path='/FAQ' element={<FAQScreen />} />
      <Route path='/AboutUs' element={<AboutUsScreen />} />

      {/* Private Routes - Must be logged in to view */}
      <Route path='' element={<PrivateRoute />} >
        <Route path='/IETracking' element={<IncomeExpenseTracking />} />
        <Route path='/upgrade' element={<BecomeMember />} />
        <Route path='/Profile' element={<ProfileScreen />} />
        
        {/* <Route path='' element={<newMemberRoute />} >
          Add new member only page here (the upgrade one)
        </Route> */}
      </Route>

      {/* <Route path='' element={<AdminRoute />} >
        Add admin only page here
      </Route> */}

    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router}/>
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
