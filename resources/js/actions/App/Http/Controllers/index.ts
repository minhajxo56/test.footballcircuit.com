import Auth from './Auth'
import DashboardController from './DashboardController'
import ActivityLogController from './ActivityLogController'
import UserController from './UserController'
import HolidayController from './HolidayController'
import SystemSettingsController from './SystemSettingsController'
import UserApplicationController from './UserApplicationController'
import ScheduleController from './ScheduleController'
import TourController from './TourController'
import LetterController from './LetterController'
import Settings from './Settings'
const Controllers = {
    Auth: Object.assign(Auth, Auth),
DashboardController: Object.assign(DashboardController, DashboardController),
ActivityLogController: Object.assign(ActivityLogController, ActivityLogController),
UserController: Object.assign(UserController, UserController),
HolidayController: Object.assign(HolidayController, HolidayController),
SystemSettingsController: Object.assign(SystemSettingsController, SystemSettingsController),
UserApplicationController: Object.assign(UserApplicationController, UserApplicationController),
ScheduleController: Object.assign(ScheduleController, ScheduleController),
TourController: Object.assign(TourController, TourController),
LetterController: Object.assign(LetterController, LetterController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers