import Auth from './Auth'
import DashboardController from './DashboardController'
import ScheduleController from './ScheduleController'
import UserApplicationController from './UserApplicationController'
import LetterController from './LetterController'
import UserController from './UserController'
import HolidayController from './HolidayController'
import TourController from './TourController'
import ActivityLogController from './ActivityLogController'
import Settings from './Settings'

const Controllers = {
    Auth: Object.assign(Auth, Auth),
    DashboardController: Object.assign(DashboardController, DashboardController),
    ScheduleController: Object.assign(ScheduleController, ScheduleController),
    UserApplicationController: Object.assign(UserApplicationController, UserApplicationController),
    LetterController: Object.assign(LetterController, LetterController),
    UserController: Object.assign(UserController, UserController),
    HolidayController: Object.assign(HolidayController, HolidayController),
    TourController: Object.assign(TourController, TourController),
    ActivityLogController: Object.assign(ActivityLogController, ActivityLogController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers