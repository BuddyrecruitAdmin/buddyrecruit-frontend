export const UI = {
    DASHBOARD: '/dashboard',
    LOGIN: '/login',
    LOGOUT: '/logout',
    JD:{
        LIST: '/list',
        NEW: '/jd/new',
        UPDATE: '/jd/detail/:id',
        DETAIL: '/jd/detail/:id'
    },
    FARMER: {
        LIST: '/farmer/list',
        NEW: '/farmer/new',
        UPDATE: '/farmer/update',
        DETAIL: '/farmer/detail/:id'
    },
    CUSTOMER: {
        LIST: '/customer/list',
        NEW: '/customer/new',
        UPDATE: '/customer/update',
        DETAIL: '/customer/detail/:id'
    },
    ORDER: {
        LIST: '/order/list',
        NEW: '/order/new',
        UPDATE: '/order/update',
        DETAIL: '/order/detail/:id'
    },
    SETTINGS: {
        CATEGORY: {
            LIST: '/settings/category/list',
            NEW: '/settings/category/new',
            UPDATE: '/settings/category/update',
            DETAIL: '/settings/category/detail/:id'
        },
        PRODUCT: {
            LIST: '/settings/product/list',
            NEW: '/settings/product/new',
            DETAIL: '/settings/product/detail/:id',
            UPDATE: '/settings/product/update',
            
        },
        SHIPPING: {
            LIST: '/settings/shipping/list',
            NEW: '/settings/shipping/new',
            UPDATE: '/settings/shipping/update',
            DETAIL: '/settings/shipping/detail/:id'
        },
    },
    POWERSETTINGS: {
        USER: {
            LIST: '/user/list',
            NEW: '/user/new',
            UPDATE: '/user/update',
            DETAIL: '/user/detail/:id'
        },
        ROLE: {
            LIST: '/role/list',
            NEW: '/role/new',
            UPDATE: '/role/update',
            DETAIL: '/role/detail/:id'
        }
    }
};