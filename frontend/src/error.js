// TODO copy-paste from backend/libs/error.js
module.exports = {
    ErrorCode: {
        Other: "Other",
        // Aggregation: "Aggregation",
        Db: "Db",
        Auth: "Auth",
        Validation: "Validation"
    },
    Other: {
        BadRequest: "BadRequest",
        NotFound: "NotFound"
    },
    Auth: {
        NoUser: "NoUser",
        WrongPassword: "WrongPassword"
    },
    Db: {
        NotFound: "NotFound"
    }
};
