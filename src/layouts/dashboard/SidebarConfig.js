// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Label from '../../components/Label';
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  word: getIcon('ic_word'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  legalagreement: getIcon('ic_legal-agreement'),
  blocklimitedword: getIcon('ic_blocklimitedword'),
  settings: getIcon('ic_settings'),
  announcement: getIcon('ic_announcement')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      {
        title: 'app',
        path: PATH_DASHBOARD.general.app,
        icon: ICONS.dashboard
      },
      // MANAGEMENT : LEGAL AGREEMENT
      {
        title: 'Legal Agreement',
        path: PATH_DASHBOARD.legalagreement.root,
        icon: ICONS.legalagreement,
        children: [
          { title: 'Privacy Policy', path: PATH_DASHBOARD.legalagreement.privacyPolicy },
          { title: 'User Agreement', path: PATH_DASHBOARD.legalagreement.userAgreement },
          { title: 'edit', path: PATH_DASHBOARD.legalagreement.edit }
        ]
      }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // MANAGEMENT : USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'list', path: PATH_DASHBOARD.user.list },
          { title: 'create', path: PATH_DASHBOARD.user.newUser }
        ]
      },
      {
        title: 'Settings',
        path: PATH_DASHBOARD.settings.root,
        icon: ICONS.settings,
        children: [{ title: 'Parameters', path: PATH_DASHBOARD.settings.parameters }]
      }
    ]
  },
  // CHAT
  // ----------------------------------------------------------------------
  {
    subheader: 'chat',
    items: [
      {
        title: 'chat',
        path: PATH_DASHBOARD.chat.root,
        icon: ICONS.chat,
        children: [{ title: 'Private', path: PATH_DASHBOARD.chat.private }]
      },
      {
        title: 'announcement',
        path: PATH_DASHBOARD.announcement.root,
        icon: ICONS.announcement,
        children: [{ title: 'Post', path: PATH_DASHBOARD.announcement.post }]
      },
      // MANAGEMENT : Word Restrication
      {
        title: 'Prohibited Words',
        path: PATH_DASHBOARD.prohibitedwords.root,
        icon: ICONS.word,
        children: [
          { title: 'List', path: PATH_DASHBOARD.prohibitedwords.list },
          { title: 'Create new', path: PATH_DASHBOARD.prohibitedwords.new }
        ]
      }
      // {
      //   title: 'Block Limited Words',
      //   path: PATH_DASHBOARD.blocklimitedwords.root,
      //   icon: ICONS.blocklimitedword,
      //   children: [
      //     { title: 'List', path: PATH_DASHBOARD.blocklimitedwords.list },
      //     { title: 'Create new', path: PATH_DASHBOARD.blocklimitedwords.new }
      //   ]
      // }
    ]
  },
  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'app',
    items: [
      {
        title: 'mail',
        path: PATH_DASHBOARD.mail.root,
        icon: ICONS.mail,
        // info: <Label color="error">2</Label>
        children: [{ title: 'List', path: PATH_DASHBOARD.mail.list }]
      }
    ]
  }
];

export default sidebarConfig;
