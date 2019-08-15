export const Gender = {
  Male: "male",
  Female: "female",
  Unknown: "unknown"
};

export const ResponseCode = {
  Success: 200,
  NotFound: 400,
  Catch: -99,
  Error: -1,
  Duplicate: 11000
};

export const JDStatus = {
  Used: "JSD001",
  NotUsed: "JSD002"
};

export const ResponseMessage = {
  Success: "success"
};

export const PageAction = {
  List: "list",
  Create: "create",
  Delete: "delete",
  Update: "update",
  Cancel: "cancel",
  Validate: "validate",
  Reset: "reset",
  Remove: "remove",
  Warning: "warning"
};

export const ListPaging = {
  ItemPerPage: 20,
  showingPage: 5
};

export const ModalPaging = {
  ItemPerPage: 10
};

export const APIParam = {
  SortBy: "sort_by",
  SortType: "sort_type",
  PageSize: "page_size",
  PageNumber: "page_number"
};

export const Shipper = {
  Registered: {
    Value: "registered",
    Name: {
      Th: "ไปรษณีย์ลงทะเบียน",
      En: "Registered"
    },
    group: "domestic"
  },
  EMS: {
    Value: "ems",
    Name: {
      Th: "ไปรษณีย์ EMS",
      En: "EMS"
    },
    group: "domestic"
  },
  Kerry: {
    Value: "kerry express",
    Name: {
      Th: "Kerry Express",
      En: "Kerry Express"
    },
    group: "domestic"
  },
  AirMail: {
    Value: "sme airmail",
    Name: {
      Th: "SME Air Mail",
      En: "SME Air Mail"
    },
    group: "international"
  }
};

export const ShippersDomestic = [
  Shipper.Registered,
  Shipper.EMS,
  Shipper.Kerry
];

export const ShippersInternational = [Shipper.AirMail];

export const ShippingType = {
  Domestic: {
    Value: "domestic",
    Name: {
      Th: "ภายในประเทศ",
      En: "Domestic"
    }
  },
  International: {
    Value: "international",
    Name: {
      Th: "ระหว่างประเทศ",
      En: "International"
    }
  }
};

export const WeightUnitType = {
  G: {
    Value: "g",
    Name: {
      Th: "กรัม",
      En: "gram"
    }
  },
  Kg: {
    Value: "kg",
    Name: {
      Th: "กิโลกรัม",
      En: "Kilogram"
    }
  }
};

export const WeightUnits = [WeightUnitType.G, WeightUnitType.Kg];

export const EnableStatus = {
  True: {
    Value: true,
    Name: {
      Th: "ใช้งาน",
      En: "Active"
    }
  },
  False: {
    Value: false,
    Name: {
      Th: "ปิดการใช้งาน",
      En: "Inactive"
    }
  }
};

export const LocalStorage = {
  Name: "hwhp-authorization",
  Username: "hwhp-username",
  URL: "URL-TEMP",
  UserId: "userid",
  UserKey: "userKey",
  HasJobDb: "hasJobDb",
};


export const LocalStorageSmart = {
  id: "id",
  description: "",
  position: "position"
};

export const UserRole = {
  Admin: "admin",
  HR: "hr",
  PY: "py",
  TeamLead: "teamlead"
};

export const ToggleOption = {
  OnColor: "success",
  OffColor: "secondary",
  OnText: "เปิดใช้งาน",
  OffText: "ปิดใช้งาน",
  Disabled: false,
  Size: "sm",
  Value: false
};

export const MemberIndividual = {
  Name: "Individual"
};

export const MemberFamily = {
  Name: "Family"
};

export const MemberCompany = {
  Name: "Company"
};

export const MemberEnterprise = {
  Name: "Enterprise"
};

export const MemberShips = [
  MemberIndividual,
  MemberFamily,
  MemberCompany,
  MemberEnterprise
];
