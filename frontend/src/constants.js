//API endpoints
export class Endpoints {
    //user
    static LOGIN = "/api/users/login";
    static REGISTER = "/api/users/register/";
    static UPDATE_PROFILE = "/api/users/profile/update/";

    //timesheet
    static GET_TIMESHEET_DETAIL = (id) => `/api/timesheets/${id}`;
    static GET_USER_TIMESHEET = (userId) => `/api/users/${userId}/timesheets/`;
    static UPDATE_TIMESHEET = (timesheetId) => `/api/timesheets/update/${timesheetId}/`;
    static CREATE_TIMESHEET = "/api/timesheets/create/";
    static DELETE_TIMESHEET = (timesheetId) => `/api/timesheets/delete/${timesheetId}/`;

    //lineitem
    static UPDATE_LINE_ITEM = (lineItemId) => `/api/lineitems/update/${lineItemId}/`;
    static CREATE_LINE_ITEM = "/api/lineitems/create/";
    static DELETE_LINE_ITEM = "/api/lineitems/delete/";
}