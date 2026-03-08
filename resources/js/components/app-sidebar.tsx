import { Link } from '@inertiajs/react';
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
import type { NavItem } from '@/types';

// Grouped Navigation mapping based on CF-HRM Blueprint
const navGroups = [
    {
        title: 'Workspace',
        items: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
            { title: 'My Schedule', href: '/my-schedule', icon: Calendar },
            { title: 'My Applications', href: '/my-applications', icon: FileText },
        ]
    },
    {
        title: 'Operations',
        items: [
            { title: 'Team Inbox', href: '/applications', icon: BookOpen },
            { title: 'Master Roster', href: '/schedules', icon: Calendar },
            { title: 'Tours & Travel', href: '/tours', icon: Plane },
        ]
    },
    {
        title: 'Administration',
        items: [
            { title: 'Employees Directory', href: '/users', icon: Users },
            { title: 'Official Letters', href: '/letters', icon: Mail },
            { title: 'Activity Logs', href: '/activity-logs', icon: Settings },
        ]
    }
];


export function AppSidebar() {
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
                {/* Dynamically render grouped sections */}
                {navGroups.map((group) => (
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