
module.exports = {
    ErrorCode: {
        Other: "Other",
        // Aggregation: "Aggregation",
        Db: "Db",
        Auth: "Auth",
        Validation: "Validation",
        Verification: "Verification"
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
    },
    Verification: {
        NotUnique: "NotUnique"
    }
};
