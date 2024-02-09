import { Route, Routes } from 'react-router-dom';
import './App.css'
import Sidenav from './components/SideNav/Sidenav'
import DashBoardLayout from './Layout/DashboardLayout/DashBoardLayout';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import ProductPageForm from './components/ProductPage/ProductPageForm';
import SuppliersPageForm from './components/Suppliers/SuppliersPageForm';
import { Toaster } from 'react-hot-toast';

const routesConfig = [
  { path: '/', element: <Home /> },
  { path: '/inventory', element: <Dashboard /> },
  {
    path: '/product/:id',
    element: <ProductPageForm />,
  },
  {
    path: '/supplier/:id',
    element: <SuppliersPageForm />,
  },
];

function generateRoutes(config) {
  return config.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      element={
        // <PrivateRoute>
        <DashBoardLayout>
          {route.element}
        </DashBoardLayout>
        // </PrivateRoute>
      }
    />
  ));
}

function App() {

  return (
    <div className='main-dashboard'>
      <Toaster />
      <Sidenav />
      <Routes>
        {generateRoutes(routesConfig)}
        {/* <Route
          path='/login'
          element={<LoginPage />}
        /> */}
      </Routes>
    </div>
  )
}

export default App
