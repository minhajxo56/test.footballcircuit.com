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

// 1. Use lowercase/snake_case strings to strictly match the normalized backend roles
const ROLES = {
    ALL: ['admin', 'ceo', 'hr', 'team_in_charge', 'employee', 'intern'],
    EMPLOYEE_UP: ['admin', 'ceo', 'hr', 'team_in_charge', 'employee'],
    MANAGER_UP: ['admin', 'ceo', 'hr', 'team_in_charge'],
    HR_UP: ['admin', 'ceo', 'hr'],
    ADMIN_ONLY: ['admin']
};

export function AppSidebar() {
    // Grab auth from Inertia props. Using `any` avoids strict TypeScript interface errors if your types aren't fully mapped.
    const { auth } = usePage<any>().props;
    
    // 2. Normalize the DB role exactly like RoleMiddleware.php does!
    // E.g., "Team In-Charge" becomes "team_in_charge", "Employee" becomes "employee"
    const rawRole = auth?.user?.role?.name || 'intern';
    const userRole = rawRole.toLowerCase().replace(/[\s-]/g, '_');

    // 3. Filter the navigation groups based on the normalized userRole
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
                ]
            },
            {
                title: 'Administration',
                items: [
                    { title: 'Employees Directory', href: '/users', icon: Users, allowed: ROLES.HR_UP },
                    { title: 'Official Letters', href: '/letters', icon: Mail, allowed: ROLES.EMPLOYEE_UP },
                    { title: 'Activity Logs', href: '/activity-logs', icon: Settings, allowed: ROLES.ADMIN_ONLY },
                ]
            }
        ];

        return groups
            .map(group => ({
                ...group,
                items: group.items.filter(item => item.allowed.includes(userRole))
            }))
            .filter(group => group.items.length > 0); // Completely hide empty headers like "Operations" for Interns
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
                {/* 4. CRITICAL: We map over filteredNavGroups here, NOT the static array */}
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