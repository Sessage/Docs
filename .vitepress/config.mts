import { defineConfig, type DefaultTheme } from 'vitepress'

const germanSidebar: DefaultTheme.SidebarItem[] = [
  { text: 'Loslegen', items: [
    { text: 'Überblick', link: '/' },
    { text: 'Erste Schritte', link: '/erste-schritte' },
    { text: 'Community vs. Enterprise', link: '/editionen' }
  ]},
  { text: 'Community Edition', items: [
    { text: 'Community-Überblick', link: '/community/' },
    { text: 'Listen und Navigation', link: '/listen-und-navigation' },
    { text: 'Aufgaben bearbeiten', link: '/aufgaben' },
    { text: 'Ansichten', link: '/ansichten' },
    { text: 'Zusammenarbeit und Teilen', link: '/zusammenarbeit' },
    { text: 'Labels', link: '/labels-felder-formulare' },
    { text: 'Benachrichtigungen', link: '/benachrichtigungen' },
    { text: 'Export und Papierkorb', link: '/import-export-papierkorb' },
    { text: 'Konto und Administration', link: '/konto-administration' },
    { text: 'Community mit Docker installieren', link: '/community/installation' },
    { text: 'Community direkt auf Linux', link: '/community/linux-direkt' }
  ]},
  { text: 'Enterprise Edition', items: [
    { text: 'Enterprise-Überblick', link: '/enterprise/' },
    { text: 'Portfolios und Dashboards', link: '/enterprise/portfolios-dashboards' },
    { text: 'Formulare und benutzerdefinierte Felder', link: '/enterprise/formulare' },
    { text: 'Automatisierung und Webhooks', link: '/automatisierung' },
    { text: 'E-Mail-Import', link: '/enterprise/email-import' },
    { text: 'AD-Verzeichnisfreigaben', link: '/enterprise/verzeichnisfreigaben' },
    { text: 'Enterprise installieren', link: '/enterprise/installation' },
    { text: 'Enterprise ohne Docker', link: '/enterprise/direktinstallation' }
  ]},
  { text: 'Editionen und Clients', items: [
    { text: 'Installationsauswahl', link: '/installation' },
    { text: 'Docker-Konfiguration', link: '/docker-konfiguration' },
    { text: 'API und mobile App', link: '/api-mobile' },
    { text: 'Swagger und OpenAPI', link: '/swagger' }
  ]}
]

const englishSidebar: DefaultTheme.SidebarItem[] = [
  { text: 'Getting started', items: [
    { text: 'Overview', link: '/en/' },
    { text: 'First steps', link: '/en/getting-started' },
    { text: 'Community vs. Enterprise', link: '/en/editions' }
  ]},
  { text: 'Product editions', items: [
    { text: 'Community Edition', link: '/en/community/' },
    { text: 'Enterprise Edition', link: '/en/enterprise/' },
    { text: 'Choose an installation', link: '/en/installation' },
    { text: 'API and mobile app', link: '/en/api-mobile' }
  ]},
  { text: 'Detailed reference', items: [
    { text: 'Full German documentation', link: '/' }
  ]}
]

const languagePreferenceScript = `
(() => {
  const key = 'sessage-docs-language';
  const path = window.location.pathname.replace(/\\/index\\.html$/, '/');
  const isHome = path === '/' || path === '';
  const stored = localStorage.getItem(key);
  if (isHome && stored === 'en') {
    window.location.replace('/en/');
    return;
  }
  if (isHome && !stored) {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const prefersGerman = languages.some((language) => String(language).toLowerCase().startsWith('de'));
    if (!prefersGerman) {
      localStorage.setItem(key, 'en');
      window.location.replace('/en/');
      return;
    }
    localStorage.setItem(key, 'de');
  }
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest('.VPNavBarTranslations a, .VPNavScreenTranslations a');
    if (!(link instanceof HTMLAnchorElement)) return;
    const targetPath = new URL(link.href, window.location.href).pathname;
    localStorage.setItem(key, targetPath.startsWith('/en/') ? 'en' : 'de');
  }, true);
})();
`

export default defineConfig({
  title: 'Sessage',
  description: 'Documentation for Sessage Community and Enterprise',
  // Die produktive Dokumentation wird unter der eigenen Domain im Wurzelpfad ausgeliefert.
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  head: [['script', {}, languagePreferenceScript]],
  locales: {
    root: {
      label: 'Deutsch',
      lang: 'de-DE',
      title: 'Sessage Dokumentation',
      description: 'Nutzerhandbuch und Betriebsdokumentation für Sessage',
      themeConfig: {
        siteTitle: 'Sessage',
        i18nRouting: false,
        nav: [
          { text: 'Community', link: '/community/' },
          { text: 'Enterprise', link: '/enterprise/' },
          { text: 'Editionen vergleichen', link: '/editionen' },
          { text: 'API & Mobile', link: '/api-mobile' }
        ],
        sidebar: germanSidebar,
        langMenuLabel: 'Sprache wechseln',
        sidebarMenuLabel: 'Navigation',
        returnToTopLabel: 'Nach oben',
        skipToContentLabel: 'Zum Inhalt springen',
        outline: { level: [2, 3], label: 'Auf dieser Seite' },
        docFooter: { prev: 'Vorherige Seite', next: 'Nächste Seite' },
        lastUpdated: { text: 'Zuletzt aktualisiert', formatOptions: { dateStyle: 'medium', timeStyle: 'short' } },
        footer: {
          message: '<a href="https://sessage.com/de/impressum/">Impressum</a> · <a href="https://sessage.com/de/datenschutz/">Datenschutzerklärung</a>',
          copyright: 'Sessage'
        },
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Sessage Documentation',
      description: 'User and operations documentation for Sessage',
      themeConfig: {
        siteTitle: 'Sessage',
        i18nRouting: false,
        nav: [
          { text: 'Community', link: '/en/community/' },
          { text: 'Enterprise', link: '/en/enterprise/' },
          { text: 'Compare editions', link: '/en/editions' },
          { text: 'API & Mobile', link: '/en/api-mobile' }
        ],
        sidebar: englishSidebar,
        langMenuLabel: 'Change language',
        sidebarMenuLabel: 'Navigation',
        returnToTopLabel: 'Return to top',
        skipToContentLabel: 'Skip to content',
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        lastUpdated: { text: 'Last updated', formatOptions: { dateStyle: 'medium', timeStyle: 'short' } },
        footer: {
          message: '<a href="https://sessage.com/de/impressum/">Legal notice</a> · <a href="https://sessage.com/de/datenschutz/">Privacy policy</a>',
          copyright: 'Sessage'
        },
      }
    }
  },
  themeConfig: {
    siteTitle: 'Sessage',
    i18nRouting: false,
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Dokumentation durchsuchen',
                buttonAriaLabel: 'Dokumentation durchsuchen'
              },
              modal: {
                displayDetails: 'Detaillierte Treffer anzeigen',
                resetButtonTitle: 'Suche zurücksetzen',
                backButtonTitle: 'Suche schließen',
                noResultsText: 'Keine Ergebnisse gefunden für',
                footer: {
                  selectText: 'Auswählen',
                  selectKeyAriaLabel: 'Eingabetaste',
                  navigateText: 'Navigieren',
                  navigateUpKeyAriaLabel: 'Pfeil nach oben',
                  navigateDownKeyAriaLabel: 'Pfeil nach unten',
                  closeText: 'Schließen',
                  closeKeyAriaLabel: 'Escape-Taste'
                }
              }
            }
          }
        }
      }
    }
  }
})
