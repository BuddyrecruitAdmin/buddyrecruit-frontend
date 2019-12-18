export const API_ENDPOINT = {
  USERS: {
    LOGIN: "login",
    LOGOUT: "logout",
    ME: "me",
    FORGOTTEN: "forgotten",
    CONFIRMPASSWORD: "changePassword",
    SESSION: "session",
    CALENDAR: {
      LIST: "user/calendar/list",
      BY_JR: "user/calendar/jr",
      EDIT: "user/calendar/edit",
    },
    WORKING_DAYS: {
      LIST: "user/workingDays/list",
      EDIT: "user/workingDays/edit",
    },
    NOTIFICATION: {
      CHECK_NEW: "notification/checkNew",
      LIST: "notification/list",
      MARK_AS_READ: "notification/markAsRead",
      MARK_AS_SEEN: "notification/markAsSeen",
    }
  },
  JOBDESCRIPTION: {
    LIST: "jd/list",
    DETAIL: "jd/detail",
    CREATE: "jd/create",
    EDIT: "jd/edit",
    DELETE: "jd/delete",
    EDUCATION: "degree/list"
  },
  JOBREQUEST: {
    LIST: "jr/list",
    DETAIL: "jr/detail",
    CREATE: "jr/create",
    EDIT: "jr/edit",
    DELETE: "jr/delete",
    APPROVE: "jr/approve",
    REJECT: "jr/reject",
    SOURCE: "source/mode/{mode}",
    ACTION: "jr/action",
    USERS: "jr/users",
    CLOSE: "jr/close",
    TOGGLE: "jr/active"
  },
  TALENT_POOL: {
    LIST: "talentPool/list",
    DETAIL: "talentPool/detail",
  },
  PENDING_EXAM: {
    LIST: "pendingExam/list",
    DETAIL: "pendingExam/detail",
  },
  PENDING_APPOINTMENT: {
    LIST: "pendingAppointment/list",
    DETAIL: "pendingAppointment/detail",
  },
  PENDING_INTERVIEW: {
    LIST: "pendingInterview/list",
    DETAIL: "pendingInterview/detail",
  },
  PENDING_SIGNCONTRACT: {
    LIST: "pendingSignContract/list",
    DETAIL: "pendingSignContract/detail",
  },
  ONBOARD: {
    LIST: "onboard/list",
    DETAIL: "onboard/detail",
  },
  CANDIDATE: {
    FLOW: {
      APPROVE: "candidate/flow/approve",
      REJECT: "candidate/flow/reject",
      REVOKE: "candidate/flow/revoke",
      COMMENT: {
        LIST: "candidate/flow/comment/list",
        CREATE: "candidate/flow/comment/create",
        DELETE: "candidate/flow/comment/delete",
      },
      DETAIL: "candidate/flow/detail",
      EDIT: "candidate/flow/edit",
      PREVIEW_EMAIL: "candidate/flow/previewEmail",
      RESEND_EMAIL: "candidate/flow/resendEmail",
      SEND_EMAIL: "candidate/flow/sendEmail",
      BUY_CV: "candidate/flow/buycv",
    },
    EVALUATION: {
      EDIT: "candidateEva/edit",
      DETAIL: "candidateEva/detail",
    },
    LIST: "candidate/list",
    DETAIL: "candidate/detail",
    EDIT: "candidate/edit",
    BLOCK: "candidate/block",
    UNBLOCK: "candidate/unblock",
    BLACKLIST: "candidate/blacklist",
  },
  CONFIGURATION: {
    COMPANY_TYPE_LIST: "companyType/list",
    COMPANY_TYPE_CREATE: "companyType/create",
    COMPANY_TYPE_EDIT: "companyType/edit",
    COMPANY_TYPE_DELETE: "companyType/delete",

    COMPANY_LIST: "company/list",
    COMPANY_CREATE: "company/create",
    COMPANY_EDIT: "company/edit",
    COMPANY_DELETE: "company/delete",
    COMPANY_DETAIL: "company/detail",
  

    DEPARTMENT_LIST: "department/list",
    DEPARTMENT_CREATE: "department/create",
    DEPARTMENT_EDIT: "department/edit",
    DEPARTMENT_DELETE: "department/delete",
    DEPARTMENT_DETAIL: "department/detail",

    POSITION_LIST: "position/list",
    POSITION_CREATE: "position/create",
    POSITION_LIST_ACTIVE: "position/list/active",
    POSITION_ACTION: "position/action",
    POSITION_EDIT: "position/edit",
    POSITION_DELETE: "position/delete",

    LOCATION_LIST: "location/list",
    LOCATION_EDIT: "location/edit",
    LOCATION_CREATE: "location/create",
    LOCATION_LIST_ACTIVE: "location/list/active",
    LOCATION_ACTION: "location/action",
    LOCATION_DELETE: "location/delete",

    USER_LIST: "user/list",
    USER_CREATE: "user/create",
    USER_EDIT: "user/edit",
    USER_DELETE: "user/delete",
    USER_DETAIL: "user/detail",
    USER_LIST_ACTIVE: "user/list/active",
    USER_ACTION: "user/action",
    USER_STATUS_LIST: "user/status/list",
    ROLE_LIST: "role/list",
    USER_PROFILE: "user/profile",
    USER_PROFILE_EDIT: "user/profile/edit",
    USER_PROFILE_UPLOAD: "user/profile/upload",
    USER_ADMIN: "user/admin/list",

    REASONS_REJECT_LIST: "rejection/list",
    REASONS_REJECT_CREATE: "rejection/create",
    REASONS_REJECT_LIST_ACTIVE: "rejection/list/active",
    REASONS_REJECT_ACTION: "rejection/action",
    REASONS_REJECT_STATUS_LIST: "rejection/status/list",
    REASONS_REJECT_EDIT: "rejection/edit",
    REASONS_REJECT_DELETE: "rejection/delete",

    AUTH_LIST: "authorize/list",
    AUTH_CREATE: "authorize/create",
    AUTH_EDIT: "authorize/edit",
    AUTH_DELETE: "authorize/delete",
    AUTH_DETAIL: "authorize/detail",
    AUTH_GET_DEFAULT: "authorize/getDefault",
    AUTH_SET_DEFAULT: "authorize/setDefault",

    REJECT_STAGE_LIST: "stageReject/list",
    REJECT_STAGE_EDIT: "stageReject/edit",
    REJECT_SUBSTAGE_LIST: "stageReject/substage",
    STAGE_REJECT_LIST: "stageReject/rejectReason",
    REJECT_STAGE_ACTION: "stageReject/action",

    JOB_SCHEDULE_LIST: "configTable/schedule/list",
    JOB_SCHEDULE_DETAIL: "configTable/schedule/detail",
    JOB_SCHEDULE_ACTION: "configTable/schedule/action",

    JOB_SCHEDULE_CREATE: "create/rejectReason",
    JOB_SCHEDULE_LIST_ACTIVE: "rejectReason/list/active",
    JOB_SCHEDULE_STATUS_LIST: "rejectReason/status/list",

    EMAIL_LIST: "mailTemplate/list",
    EMAIL_ACTION: "mailTemplate/action",

    REPORT_MASTER: "report/master",
    REPORT_LIST: "report/list",
    REPORT_CREATE: "report/create",
    REPORT_EDIT: "report/edit",
    REPORT_DELETE: "report/delete",
    REPORT_DETAIL: "report/detail",

    DASHBOARD_MASTER: "dashboard/master",
    DASHBOARD_LIST: "dashboard/list",
    DASHBOARD_CREATE: "dashboard/create",
    DASHBOARD_EDIT: "dashboard/edit",
    DASHBOARD_DELETE: "dashboard/delete",
    DASHBOARD_DETAIL: "dashboard/detail",

    EVALUATION_CREATE: "evaluation/create",
    EVALUATION_LIST: "evaluation/list",
    EVALUATION_DELETE: "evaluation/delete",
    EVALUATION_DETAIL: "evaluation/detail",
    EVALUATION_EDIT: "evaluation/edit",

    MAIL_TEMPLATE_CREATE: "mailTemplate/create",
    MAIL_ACTION_LIST: "mailAction/list",
    MAIL_TEMPLATE_LIST: "mailTemplate/list",
    MAIL_TEMPLATE_EDIT: "mailTemplate/edit",
    MAIL_TEMPLATE_DETAIL: "mailTemplate/detail",
    MAIL_ACTION_DETAIL: "mailAction/detail",
    MAIL_TEMPLATE_DELETE: "mailTemplate/delete",
  },
  CV: {
    DETAIL: "candidate/id",
    CANDIDATE_REQUEST: "candidate/request",
    CANDIDATE_RESPONSE: "candidate/response",
    CANDIDATE_ORIGINAL: "candidate/cv",
    SAVE: "candidate/flow/action",
    ACCURACY: "candidate/accuracy",
    CREATE: "candidate/accuracy/create",
    LIST: "candidate/accuracy/list",
    DELETE: "candidate/accuracy/delete",
  },
  FILE: {
    UPLOAD: "jd/upload",
    DOWNLOAD: "jd/download"
  },
  APPFORM: {
    ACTION: "appForm/action",
    DETAIL: "appForm/detail",
    CREATE: "appForm/create",
  },
  DASHBOARD: {
    DASHBOARD: "dashboard"
  },
  REPORT: {
    ACTION: "report",
    LIST: "report/candidate",
    LISTFEEDBACK: "feedbackReport/list",
    EDIT: "feedbackReport/edit"
  },
  HERO: {
    LIST: "hero/list"
  },
  AUTHORIZE: {
    LIST: "authorize/list"
  },
  DROPDOWN: {
    DEPARTMENT: "dropdown/department",
    JOBPOSITION: "dropdown/position",
    USER: "dropdown/user",
  },
  CONTACT: {
    CREATE: "contact/create",
    LIST: "contact/list",
    EDIT: "contact/edit",
    DETAIL: "contact/detail",
    DELETE: "contact/delete",
  }
};
