import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../../pages/login/ui';
import { RegisterPage } from '../../pages/register/ui';
import { DashboardPage } from '../../pages/dashboard/ui';
import { RoomPage } from '../../pages/room/ui';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Welcome to StudyRoom</div>,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/room/:roomId',
    element: <RoomPage />,
  },
]);