export const API_ENDPOINT = {
  USERS: {
    LOGIN: "login",
    LOGOUT: "logout",
    ME: "me",
    FORGOTTEN: "forgotten",
    CONFIRMPASSWORD: "changePassword",
    SESSION: "session"
  },
  SHARED: {
    REASONREJECT: "rejectReason"
  },
  JOBDESCRIPTION: {
    LIST: "jd/list",
    DEGREE: "degree",
    DETAIL: "jd/{id}",
    CREATE: "jd",
    UPDATE: "jd",
    DELETE: "jd/{id}"

  },
  JOBREQUEST: {
    LIST: "jr/list",
    DETAIL: "jr/detail",
    CREATE: "jr",
    UPDATE: "jr",
    DELETE: "jr/{id}",
    APPROVE: "jr/approve/{id}",
    REJECT: "jr/reject/{id}",
    SOURCE: "source/mode/{mode}",
    ACTION: "jr/action",
  },
  TALENT_POOL: {
    LIST: "talentPool",
    REASONREJECT: "rejectReason",
    NOTBUYDETAIL: "webrecruit/jr",
    MISSINGDETAIL: "candidate/flow",
    REJECTDETAIL: "webrecruit/reject",
    ACTION_CANDIDATE: "candidate/flow/action",
    ACTION_WEBRECRUIT: "webrecruit/action",
    SELECTEDLIST: "talentPool/selected"
  },
  PENDING_EXAM: {
    LIST: "pendingExam",
    DETAIL: "pendingExam/pe",
    ACTION: "pendingExam/action",
    REASONREJECT: "rejectReason",
    REJECTDETAIL: "pendingExam/reject",
    REJECTHR: "pendingExam/notify"
  },
  PENDING_APPOINTMENT: {
    LIST: "pendingAppointment",
    DETAIL: "pendingAppointment/pending",
    REJECTDETAIL: "pendingAppointment/reject",
    REASONREJECT: "rejectReason",
    ACTION: "pendingAppointment/action",
    REJECTHR: "pendingAppointment/notify",
  },
  PENDING_INTERVIEW: {
    LIST: "pendingInterview",
    DETAIL: "pendingInterview/pending",
    REJECTDETAIL: "pendingInterview/reject",
    ACTION: "pendingInterview/action",
    REASONREJECT: "rejectReason",
    REJECTHR: "pendingInterview/notify"
  },
  PENDING_SIGNCONTRACT: {
    LIST: "pendingSignContract",
    DETAIL: "pendingSignContract/pending",
    REJECTDETAIL: "pendingSignContract/reject",
    ACTION: "pendingSignContract/action",
    REASONREJECT: "rejectReason",
  },
  ONBOARD: {
    LIST: "onboard",
    DETAIL: "onboard/pending",
    REJECTDETAIL: "onboard/reject",
    ACTION: "onboard/action",
    REASONREJECT: "rejectReason",
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



    POSITION_LIST: "position/list",
    POSITION_CREATE: "create/position",
    POSITION_LIST_ACTIVE: "position/list/active",
    POSITION_ACTION: "position/action",

    DEPARTMENT_LIST: "department/list",
    DEPARTMENT_CREATE: "create/department",
    DEPARTMENT_LIST_ACTIVE: "department/list/active",
    DEPARTMENT_ACTION: "department/action",

    LOCATION_LIST: "location/list",
    LOCATION_CREATE: "create/location",
    LOCATION_LIST_ACTIVE: "location/list/active",
    LOCATION_ACTION: "location/action",

    USER_LIST: "user/list",
    USER_CREATE: "create/user",
    USER_LIST_ACTIVE: "user/list/active",
    USER_ACTION: "user/action",
    USER_STATUS_LIST: "user/status/list",
    ROLE_LIST: "role/list",

    REASONS_REJECT_LIST: "rejectReason/list",
    REASONS_REJECT_CREATE: "create/rejectReason",
    REASONS_REJECT_LIST_ACTIVE: "rejectReason/list/active",
    REASONS_REJECT_ACTION: "rejectReason/action",
    REASONS_REJECT_STATUS_LIST: "rejectReason/status/list",

    REJECT_STAGE_LIST: "stageReject/stage",
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
  },
  CV: {
    DETAIL: "candidate/id",
    CANDIDATE_REQUEST: "candidate/request",
    CANDIDATE_RESPONSE: "candidate/response",
    CANDIDATE_ORIGINAL: "candidate/cv",
    SAVE: "candidate/flow/action",
    ACCURACY: "candidate/accuracy",
  },
  FILE: {
    UPLOAD: "jd/upload",
    DOWNLOAD: "jd/download"
  },
  LOCATION: {
    LIST: "location"
  },
  PREVIEW_EMAIL: {
    DETAIL: "previewEmail"
  },
  COUNT_CANDIDATE_ALL_TAB: {
    COUNT: "count_tab"
  },
  COUNT_EXAM_ALL_TAB: {
    COUNT: "count_tab"
  },
  COUNT_APPOINTMENT_ALL_TAB: {
    COUNT: "count_tab"
  },
  COUNT_INTERVIEW_ALL_TAB: {
    COUNT: "count_tab"
  },
  COUNT_SIGNCONTRACT_ALL_TAB: {
    COUNT: "count_tab"
  },
  COUNT_ONBOARD_ALL_TAB: {
    COUNT: "count_tab"
  },
  PROFILE: {
    DETAIL: "profile",
    UPDATE: "profile/changeProfile"
  },
  APPFORM: {
    ACTION: "appForm/action"
  },
  DASHBOARD: {
    DASHBOARD: "dashboard"
  },
  REPORT: {
    ACTION: "report"
  }
};
