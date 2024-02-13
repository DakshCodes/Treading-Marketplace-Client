import { Route, Routes } from 'react-router-dom';
import './App.css'
import Sidenav from './components/SideNav/Sidenav'
import DashBoardLayout from './Layout/DashboardLayout/DashBoardLayout';
import Home from './pages/Home/Home';
import ProductPageForm from './components/ProductPage/ProductPageForm';
import { Toaster } from 'react-hot-toast';
import Inventory from './pages/Inventory/Inventory';
import { useRecoilValue } from 'recoil';
import { darkmodeAtom } from './store/darkmode/darkAtom';
import LoginPage from './pages/LoginPage/LoginPage';

const routesConfig = [
  { path: '/', element: <Home /> },
  { path: '/inventory', element: <Inventory /> },
  {
    path: '/product/:id',
    element: <ProductPageForm />,
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

  const mode = useRecoilValue(darkmodeAtom);

  return (
    <div className={`main-dashboard ${mode && 'dark'}`}>
      <Toaster />
      <Sidenav />
      <Routes>
        {generateRoutes(routesConfig)}
        <Route
          path='/login'
          element={<LoginPage />}
        />
      </Routes>
    </div>
  )
}

export default App
