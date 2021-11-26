import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> }
      ]
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <GeneralApp /> },
        {
          path: 'analytics',
          element: <GeneralAnalytics />
        },
        {
          path: 'user',
          children: [
            { path: '/', element: <Navigate to="/dashboard/user/" replace /> },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: '/:userId/edit', element: <UserCreate /> },
            { path: '/:userId/details', element: <UserDetails /> },
            { path: 'account', element: <UserAccount /> }
          ]
        },
        {
          path: 'mail',
          children: [
            { path: '/', element: <Navigate to="/dashboard/mail/all" replace /> },
            { path: '/list', element: <MailList /> },
            { path: 'label/:customLabel', element: <Mail /> },
            { path: 'label/:customLabel/:mailId', element: <Mail /> },
            { path: ':systemLabel', element: <Mail /> },
            { path: ':systemLabel/:mailId', element: <Mail /> }
          ]
        },
        {
          path: 'chat',
          children: [
            { path: '/', element: <Navigate to="/dashboard/chat" replace /> },
            { path: '/private', element: <PrivateChat /> },
            { path: '/private/:opponentId', element: <PrivateChat /> },
            { path: '/:conversationKey', element: <Chat /> },
            { path: '/new', element: <Chat /> }
          ]
        },
        {
          path: 'prohibitedwords',
          children: [
            { path: '/', element: <Navigate to="/dashboard/prohibitedwords/list" replace /> },
            { path: '/list', element: <ProhibitedWordsList /> },
            { path: '/new', element: <ProhibitedWordCreate /> },
            { path: '/:word/edit', element: <ProhibitedWordCreate /> }
          ]
        },
        {
          path: 'blocklimitwords',
          children: [
            { path: '/', element: <Navigate to="/dashboard/blocklimitwords/list" replace /> },
            { path: '/list', element: <BlockLimitedWordsList /> },
            { path: '/new', element: <BlockLimitedWordCreate /> },
            { path: '/:word/edit', element: <BlockLimitedWordCreate /> }
          ]
        },
        {
          path: 'legal-agreement',
          children: [
            { path: '/', element: <Navigate to="/dashboard/legal-agreement/" replace /> },
            { path: '/privacy-policy', element: <PrivacyPolicy /> },
            { path: '/user-agreement', element: <UserAgreement /> },
            { path: '/edit', element: <LegalAgreements /> }
          ]
        },
        {
          path: 'settings',
          children: [
            { path: '/', element: <Navigate to="/dashboard/settings/" replace /> },
            { path: '/parameters', element: <ParameterSettings /> }
          ]
        }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> },
    {
      path: '/',
      element: <MainLayout />,
      children: [{ path: '/', element: <Navigate to="/dashboard/app" replace /> }]
    }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));
// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
const ProhibitedWordsList = Loadable(lazy(() => import('../pages/dashboard/ProhibitedWordsList')));
const ProhibitedWordCreate = Loadable(lazy(() => import('../pages/dashboard/ProhibitedWordCreate')));
const BlockLimitedWordsList = Loadable(lazy(() => import('../pages/dashboard/BlockLimitedWordsList')));
const BlockLimitedWordCreate = Loadable(lazy(() => import('../pages/dashboard/BlockLimitedWordCreate')));
const LegalAgreements = Loadable(lazy(() => import('../pages/dashboard/LegalAgreements')));
const PrivacyPolicy = Loadable(lazy(() => import('../pages/dashboard/PrivacyPolicy')));
const UserAgreement = Loadable(lazy(() => import('../pages/dashboard/UserAgreement')));
const ParameterSettings = Loadable(lazy(() => import('../pages/dashboard/ParameterSettings')));

const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));
const UserDetails = Loadable(lazy(() => import('../pages/dashboard/UserDetails')));
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const PrivateChat = Loadable(lazy(() => import('../pages/dashboard/PrivateChat')));
const Mail = Loadable(lazy(() => import('../pages/dashboard/Mail')));
const MailList = Loadable(lazy(() => import('../pages/dashboard/MailList')));

// Main
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
