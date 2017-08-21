// TODO copy-paste from backend/libs/error.js
module.exports = {
    ErrorCode: {
        Other: "Other",
        Auth: "Auth",
        Validation: "Validation",
        Verification: "Verification"
    },
    Other: {
        BadRequest: "BadRequest",
        NotFound: "NotFound"
    },
    Auth: {
        WrongPasswordOrUsername: "WrongPasswordOrUsername"
    },
    Verification: {
        NotUnique: "NotUnique"
    }
};
