import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { 
    BookOpen, 
    FolderGit2, 
    LayoutGrid, 
    Calendar, 
    Users, 
    Plane, 
    FileText, 
    Settings, 
    Mail 
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes'; 

// Role hierarchy constants
const ROLES = {
    ALL: ['admin', 'ceo', 'hr', 'team_in_charge', 'employee', 'intern'],
    EMPLOYEE_UP: ['admin', 'ceo', 'hr', 'team_in_charge', 'employee'],
    MANAGER_UP: ['admin', 'ceo', 'hr', 'team_in_charge'],
    HR_UP: ['admin', 'ceo', 'hr'],
    ADMIN_ONLY: ['admin']
};

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    
    // Safely extract and normalize the role exactly like the backend
    const rawRole = auth?.user?.role?.name || 'intern';
    const userRole = rawRole.toLowerCase().replace(/[\s-]/g, '_');

    // Filter navigation items based on normalized role
    const filteredNavGroups = useMemo(() => {
        const groups = [
            {
                title: 'Workspace',
                items: [
                    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid, allowed: ROLES.ALL },
                    { title: 'My Schedule', href: '/my-schedule', icon: Calendar, allowed: ROLES.ALL },
                    { title: 'My Applications', href: '/my-applications', icon: FileText, allowed: ROLES.EMPLOYEE_UP },
                ]
            },
            {
                title: 'Operations',
                items: [
                    { title: 'Team Inbox', href: '/applications', icon: BookOpen, allowed: ROLES.MANAGER_UP },
                    { title: 'Master Roster', href: '/schedules', icon: Calendar, allowed: ROLES.MANAGER_UP },
                    { title: 'Tours & Travel', href: '/tours', icon: Plane, allowed: ROLES.HR_UP },
                    { title: 'Holidays', href: '/holidays', icon: Calendar, allowed: ROLES.HR_UP },
                ]
            },
            {
                title: 'Administration',
                items: [
                    { title: 'Employees Directory', href: '/users', icon: Users, allowed: ROLES.HR_UP },
                    { title: 'Official Letters', href: '/letters', icon: Mail, allowed: ROLES.EMPLOYEE_UP },
                    { title: 'Activity Logs', href: '/activity-logs', icon: FolderGit2, allowed: ROLES.ADMIN_ONLY },
                ]
            }
        ];

        return groups
            .map(group => ({
                ...group,
                // Filter out items the user isn't allowed to see
                items: group.items.filter(item => item.allowed.includes(userRole))
            }))
            // Filter out empty group headers (e.g., hiding 'Administration' entirely if no items remain)
            .filter(group => group.items.length > 0); 
    }, [userRole]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* CRITICAL FIX: Make sure you are mapping over `filteredNavGroups` here. 
                  If you previously had a raw array here, that's why everything was showing! 
                */}
                {filteredNavGroups.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            {group.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.href}>
                                                    <Icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}