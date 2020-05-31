export const API_ENDPOINT = {
  USERS: {
    LOGIN: "login",
    LOGOUT: "logout",
    CONSENT: "consentUser/action",
    ME: "me",
    FORGOTTEN: "forgotten",
    CONFIRMPASSWORD: "changePassword",
    SESSION: "session",
    CALENDAR: {
      LIST: "user/calendar/list",
      BY_JR: "user/calendar/jr",
      EDIT: "user/calendar/edit",
      CHECK: "user/calendar/checkUsing",
      OUTLOOK: {
        LOGIN: "user/calendar/outlook/login",
        DECODE: "user/calendar/outlook/decode",
        GET_TOKEN: "user/calendar/outlook/getToken",
        CALENDAR: "user/calendar/outlook/calendar",
        USERS: "user/calendar/outlook/users",
      }
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
    TOGGLE: "jr/active",
    GET_ACTIVE: "jr/getActive",
  },
  CONSENT: {
    LIST: "consentStage/list",
    DETAIL: "consentStage/detail",
  },
  TALENT_POOL: {
    LIST: "talentPool/list",
    DETAIL: "talentPool/detail",
    SOURCE: "source/list"
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
        EDIT: "candidate/flow/comment/edit",
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
    DASHBOARD_SOURCE: "dashboard/source",

    EVALUATION_CREATE: "evaluation/create",
    EVALUATION_LIST: "evaluation/list",
    EVALUATION_DELETE: "evaluation/delete",
    EVALUATION_DETAIL: "evaluation/detail",
    EVALUATION_EDIT: "evaluation/edit",

    EXAM_ONLINE_CREATE: "exam/create",
    EXAM_ONLINE_LIST: "exam/list",
    EXAM_ONLINE_DELETE: "exam/delete",
    EXAM_ONLINE_DETAIL: "exam/detail",
    EXAM_ONLINE_EDIT: "exam/edit",
    EXAM_ONLINE_SUBMIT: "exam/submit",

    MAIL_TEMPLATE_CREATE: "mailTemplate/create",
    MAIL_ACTION_LIST: "mailAction/list",
    MAIL_TEMPLATE_LIST: "mailTemplate/list",
    MAIL_TEMPLATE_EDIT: "mailTemplate/edit",
    MAIL_TEMPLATE_DETAIL: "mailTemplate/detail",
    MAIL_ACTION_DETAIL: "mailAction/detail",
    MAIL_TEMPLATE_DELETE: "mailTemplate/delete",

    APP_FORM: {
      CREATE: "appFormTemplate/create",
      LIST: "appFormTemplate/list",
      DETAIL: "appFormTemplate/detail",
      EDIT: "appFormTemplate/edit",
      DELETE: "appFormTemplate/delete",
      TOGGLE_ACTIVE: "appFormTemplate/toggleActive",
      GET_ACTIVE: "appFormTemplate/getActive"
    },

    CONSENT_DETAIL: "userConsentText/detail",
    CONSENT_EDIT: "userConsentText/edit"
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
    DOWNLOAD: "jd/download",
    FILE_UPLOAD: "file/upload",
    FILE_DOWNLOAD: "file/download",
  },
  APPFORM: {
    ACTION: "appForm/action",
    DETAIL: "appForm/detail",
    CREATE: "appForm/create",
  },
  DASHBOARD: {
    DASHBOARD: "dashboard",
    TIME_TO_FILL: "flowLog/list",
  },
  REPORT: {
    ACTION: "report",
    LIST: "report/candidate",
    LISTFEEDBACK: "feedbackReport/list",
    EDIT: "feedbackReport/edit",
    DEPARTMENT: "dropdown/department",
    ListCandidate: "candidateReport/list",
    STAGING: "stagingEmail/list"
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
  },
  OUTLOOK: {
    LOGIN: "outlook/login",
    DECODE: "outlook/decode",
    GET_TOKEN: "outlook/getToken",
    CALENDAR: "outlook/calendar",
    USERS: "outlook/users",
  },
  GOOGLE: {
    LOGIN: "google/login",
    DECODE: "google/decode",
    GET_TOKEN: "google/getToken",
    CALENDAR: "google/calendar",
    USERS: "google/users",
  },
  TRANSFER: {
    DEPARTMENT_LIST: "dropdown/departments",
    DIVISION_LIST: "dropdown/divisions",
    JR_LIST: "dropdown/jrs",
    SAVE: "transfer/candidateFlow",
  },
  EXAM: {
    EXAM_TEST: "sendmail/exam",
    EXAM_ANSWER: "exam/candidateAnswer",
    EXAM_EMAIL: "previewEmail/exam",
  },
  RESUME: {
    CREATE: "resume/create",
    LIST: "resume/list",
    DETAIL: "resume/detail",
    EDIT: "resume/edit",
    DELETE: "resume/delete",
  },
  APPLICATION_FORM: {
    CREATE: "generalAppForm/create",
    LIST: "generalAppForm/list",
    DETAIL: "generalAppForm/detail",
    EDIT: "generalAppForm/edit",
    DELETE: "generalAppForm/delete",
    JR_LIST: "generalAppForm/jrs",
    GET_TEMPLATE: "generalAppForm/getTemplate"
  },
  BLOG: {
    CREATE: "blog/create",
    EDIT: "blog/edit",
    LIST: "blog/list",
    DETAIL: "blog/detail",
    UPLOAD: "blog/upload",
    DELETE: "blog/delete"
  }
};
