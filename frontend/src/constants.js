//API endpoints
export class Endpoints {
    static LOGIN = "/api/users/login";
    static REGISTER = "/api/users/register/";
    static GET_TIMESHEET_DETAIL = (id) => `/api/timesheets/${id}`;
    static GET_USER_TIMESHEET = (userId) => `/api/users/${userId}/timesheets/`;
    static UPDATE_LINE_ITEM = (lineItemId) => `/api/lineitems/update/${lineItemId}/`;
    static UPDATE_TIMESHEET = (timesheetId) => `/api/timesheets/update/${timesheetId}/`;
    static UPDATE_PROFILE = "/api/users/profile/update/";
}