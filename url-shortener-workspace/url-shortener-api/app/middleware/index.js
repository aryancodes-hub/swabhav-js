const validateJsonContentType = require("./validate-json-content-type");
const validatePaginationQuery = require("./validate-pagination-query");
const validateRequest = require("./validate-request");
const authenticate = require("./authenticate");
const { authorizeAdmin, authorizeUser } = require("./authorize");
const uploadAvatar = require("./upload-avatar");
const {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} = require("../components/auth/auth.validation");
const {
    updateProfileSchema,
    changePasswordSchema
} = require("../components/user/user.validation.js");
const {
    redirectSchema,
    createUrlSchema,
    listUrlQuerySchema,
    urlParamsSchema,
    updateUrlSchema
} = require("../components/url/url.validation.js");

const { purchaseQuotaSchema } = require("../components/quota/quota.validation.js");
const {
    listPaymentQuerySchema,
    paymentParamsSchema
} = require("../components/payment/payment.validation.js");

const { reportQuerySchema } = require("./../components/report/report.validation");

module.exports = {
    validateJsonContentType,
    validatePaginationQuery,
    authenticate,
    authorizeAdmin,
    authorizeUser,
    uploadAvatar,
    // Auth
    validateAuthRegister: validateRequest(registerSchema),
    validateAuthLogin: validateRequest(loginSchema),
    validateAuthForgotPassword: validateRequest(forgotPasswordSchema),
    validateAuthResetPassword: validateRequest(resetPasswordSchema),
    // User
    validateUserUpdateProfile: validateRequest(updateProfileSchema),
    validateUserChangePassword: validateRequest(changePasswordSchema),
    // Url
    validateUrlRedirect: validateRequest(redirectSchema),
    validateUrlCreate: validateRequest(createUrlSchema),
    validateUrlListQuery: validateRequest(listUrlQuerySchema),
    validateUrlParams: validateRequest(urlParamsSchema),
    validateUrlUpdate: validateRequest(updateUrlSchema),
    // Quota
    validateQuotaPurchase: validateRequest(purchaseQuotaSchema),
    // Payment
    validatePaymentListQuery: validateRequest(listPaymentQuerySchema),
    validatePaymentParams: validateRequest(paymentParamsSchema),
    // Reports
    validateReportQuery: validateRequest(reportQuerySchema)
};
