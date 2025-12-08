export interface SidebarMenuItem {
    id: number;
    title: string;
    url: string | null; 
    icon: string | null; 
    parent_id: number | null;
    order: number;
    permission_name: string | null;
    is_active: number;
    children?: SidebarMenuItem[];
}

// Dummy data updated to match structure
export const DUMMY_MENU: SidebarMenuItem[] = [
    {
        id: 1,
        title: 'Dashboard',
        url: 'dashboard',
        icon: 'heroicons:home',
        parent_id: null,
        order: 1,
        permission_name: null,
        is_active: 1,
        children: []
    },
    {
        id: 2,
        title: 'System',
        url: null,
        icon: 'heroicons:cog-6-tooth',
        parent_id: null,
        order: 2,
        permission_name: null,
        is_active: 1,
        children: [
             {
                id: 3,
                title: 'Settings',
                url: 'futurisme.settings',
                icon: 'heroicons:adjustments-horizontal',
                parent_id: 2,
                order: 1,
                permission_name: null,
                is_active: 1,
                children: []
            }
        ]
    },
];