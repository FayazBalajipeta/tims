import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Common
      'app.name': 'TIMS',
      'app.fullName': 'Ticketing and Issue Management System',
      
      // Auth
      'auth.login': 'Sign in',
      'auth.logout': 'Sign out',
      'auth.email': 'Email address',
      'auth.password': 'Password',
      'auth.rememberMe': 'Remember me',
      'auth.forgotPassword': 'Forgot password?',
      
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.tickets': 'Tickets',
      'nav.analytics': 'Analytics',
      'nav.userManagement': 'User Management',
      'nav.settings': 'Settings',
      
      // Tickets
      'ticket.create': 'Create Ticket',
      'ticket.title': 'Title',
      'ticket.description': 'Description',
      'ticket.category': 'Category',
      'ticket.priority': 'Priority',
      'ticket.status': 'Status',
      'ticket.assignedTo': 'Assigned To',
      
      // Common Actions
      'action.save': 'Save',
      'action.cancel': 'Cancel',
      'action.delete': 'Delete',
      'action.edit': 'Edit',
      'action.view': 'View',
      'action.search': 'Search',
      'action.filter': 'Filter',
      'action.export': 'Export',
    },
  },
  es: {
    translation: {
      'app.name': 'TIMS',
      'app.fullName': 'Sistema de Gestión de Tickets',
      'auth.login': 'Iniciar sesión',
      'nav.dashboard': 'Panel de control',
      'nav.tickets': 'Tickets',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
