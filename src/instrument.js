// Error reporting. Imported first in main.jsx so errors during start-up are caught.
// Without VITE_SENTRY_DSN (local development) Sentry stays off and every call is a no-op.
import * as Sentry from '@sentry/react';

// Reset and email-verification links carry secret tokens in the query string
const stripQuery = (url) => (typeof url === 'string' ? url.split('?')[0] : url);

const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // This is a finance app: errors only, no personal data. No session replay or performance
    // tracing. SDK v11 collects all of this by default and ignores the old sendDefaultPii option,
    // so each category is switched off here (userInfo: false also stops Sentry storing the IP).
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false, // includes Referer, which can hold a full URL with a token
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
    },
    integrations: (defaults) => defaults.filter((integration) => integration.name !== 'Breadcrumbs').concat(
      // Page and request breadcrumbs help debugging; console logs and clicked text could hold user data
      Sentry.breadcrumbsIntegration({ console: false, dom: false })
    ),
    beforeBreadcrumb(breadcrumb) {
      if (breadcrumb.data) {
        if (breadcrumb.data.url) breadcrumb.data.url = stripQuery(breadcrumb.data.url);
        if (breadcrumb.data.from) breadcrumb.data.from = stripQuery(breadcrumb.data.from);
        if (breadcrumb.data.to) breadcrumb.data.to = stripQuery(breadcrumb.data.to);
      }
      return breadcrumb;
    },
    beforeSend(event) {
      if (event.request?.url) event.request.url = stripQuery(event.request.url);
      if (event.request) {
        delete event.request.query_string;
        delete event.request.headers;
        delete event.request.cookies;
      }
      if (event.user) delete event.user.ip_address;
      return event;
    },
  });
}
