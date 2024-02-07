import { Route, Routes } from 'react-router-dom';
import './App.css'
import Sidenav from './components/SideNav/Sidenav'
import DashBoardLayout from './Layout/DashboardLayout/DashBoardLayout';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';

const routesConfig = [
  { path: '/', element: <Home /> },
  { path: '/dashboard', element: <Dashboard /> },
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
