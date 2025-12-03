export const defaultMenus = [
    // Quick Links
    { id: 101, title: 'Inbox', url: 'futurisme.inbox', icon: 'heroicons:inbox', badge: 12 },
    { id: 102, title: 'Notifications', url: 'futurisme.notifications', icon: 'heroicons:bell', badge: '15+' },
    
    // Main Menu Group
    { 
        id: 1, 
        title: 'Menu', 
        header: 'Menu', 
        children: [
            { id: 11, title: 'Dashboard', url: 'futurisme.dashboard', icon: 'heroicons:squares-2x2' },
            { id: 12, title: 'Analytics', url: 'futurisme.analytics', icon: 'heroicons:chart-bar' },
            { id: 13, title: 'Reporting', url: 'futurisme.reports', icon: 'heroicons:presentation-chart-line' },
            { id: 14, title: 'Orders', url: 'futurisme.orders', icon: 'heroicons:clipboard-document-list' },
            { id: 15, title: 'Invoices', url: 'futurisme.invoices', icon: 'heroicons:document-text' },
            { id: 16, title: 'Manufactures', url: 'futurisme.manufactures', icon: 'heroicons:building-office-2' },
            { id: 99, title: 'Trash', url: 'futurisme.trash', icon: 'heroicons:trash' },
        ]
    },
];

export const bottomMenus = [
    { id: 201, title: 'Preferences', url: 'futurisme.settings', icon: 'heroicons:adjustments-horizontal' },
    { id: 202, title: 'Dark mode', url: '#', icon: 'heroicons:moon' },
    { id: 203, title: 'Themes', url: '#', icon: 'heroicons:swatch' },
    { id: 204, title: 'Help', url: '#', icon: 'heroicons:question-mark-circle' },
];