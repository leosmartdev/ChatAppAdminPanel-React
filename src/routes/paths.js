// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    analytics: path(ROOTS_DASHBOARD, '/analytics')
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
    list: path(ROOTS_DASHBOARD, '/mail/list')
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey'),
    private: path(ROOTS_DASHBOARD, '/chat/private'),
    privateConversation: path(ROOTS_DASHBOARD, '/chat/private/:opponentId')
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account')
  },
  prohibitedwords: {
    root: path(ROOTS_DASHBOARD, '/prohibitedwords'),
    list: path(ROOTS_DASHBOARD, '/prohibitedwords/list'),
    new: path(ROOTS_DASHBOARD, '/prohibitedwords/new')
  },
  blocklimitedwords: {
    root: path(ROOTS_DASHBOARD, '/blocklimitwords'),
    list: path(ROOTS_DASHBOARD, '/blocklimitwords/list'),
    new: path(ROOTS_DASHBOARD, '/blocklimitwords/new')
  },
  legalagreement: {
    root: path(ROOTS_DASHBOARD, '/legal-agreement'),
    privacyPolicy: path(ROOTS_DASHBOARD, '/legal-agreement/privacy-policy'),
    userAgreement: path(ROOTS_DASHBOARD, '/legal-agreement/user-agreement'),
    edit: path(ROOTS_DASHBOARD, '/legal-agreement/edit')
  },
  settings: {
    root: path(ROOTS_DASHBOARD, '/settings'),
    parameters: path(ROOTS_DASHBOARD, '/settings/parameters')
  }
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
