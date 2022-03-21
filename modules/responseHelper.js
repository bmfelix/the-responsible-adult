/**
 * Utility functions that will be used by many API functions.
 *
 * @author Brad Felix <bradfelix1@gmail.com>
 */

const baseResponse = {
    headers: {
        // CORS
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'x-requested-with',
        'Access-Control-Allow-Credentials': true,

        // Disallow iFrames from other domains to prevent click jacking.
        'X-Frame-Options': 'SAMEORIGIN',

        // Add X-XSS-Protection to mitigate Cross-Site scripting attack.
        'X-XSS-Protection': '1 mode=block',

        // Add X-Content-Type-Options header to prevent script and style injection.
        'X-Content-Type-Options': 'nosniff',

        // Add Referrer-Policy to avoid sending referer information to external websites.
        'Referrer-Policy': 'same-origin',

        // Direct robots not to be all up in our application.
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noodp, noimageindex',
    },
    body: '',
}

if (!process.env.IS_OFFLINE) {
    // Add Strict-Transport-Security header to mitigate MITM attacks.
    baseResponse.headers['Strict-Transport-Security'] = 'max-age=15768000 includeSubDomains preload'

    // @future Add a content security policy so browsers know what is expected and safe from this domain.
    // baseResponse.headers['Content-Security-Policy'] = "default-src 'self' connect-src 'self' http: https: font-src 'self' https://fonts.gstatic.com img-src 'self' script-src 'self' 'unsafe-inline' 'unsafe-eval' style-src 'self' 'unsafe-inline'"
}

const baseAuthorizationResponse = {
    statusCode: 403,
    body: {
        error: 'You do not have permission to perform the requested action.',
        fields: [],
    },
    ...baseResponse
}

const baseAuthenticationResponse = {
    statusCode: 401,
    ...baseResponse
}
const baseBadRequest = {
    statusCode: 400,
    ...baseResponse
}
const baseCreated = {
    statusCode: 201,
    ...baseResponse
}
const baseNoContent = {
    statusCode: 204,
    ...baseResponse
}
const baseSuccess = {
    statusCode: 200,
    ...baseResponse
}
const baseServerError = {
    statusCode: 500,
    ...baseResponse
}
const baseNotFound = {
    statusCode: 404,
    ...baseResponse
}

const errorResponse = (errorMessage, awsRequestId, callback) => {
    const response = baseServerError

    response.body = JSON.stringify({
        Error: errorMessage,
        Reference: awsRequestId,
    })

    return callback(null, response)
}

const permissionResponse = (callback) => {
    const response = baseAuthorizationResponse

    return callback(null, response)
}

const validationResponse = (validationResult, callback) => {
    const response = baseBadRequest
    const responseBody = {
        error: 'Please check your inputs.',
        fields: [],
    }

    validationResult.error.details.map((detail) => {
        responseBody.fields.push({
            name: detail.path,
            message: detail.message,
        })
    })
    response.body = JSON.stringify(responseBody)

    return callback(null, response)
}

module.exports = {
    badRequest: baseBadRequest,
    created: baseCreated,
    errorResponse,
    forbidden: baseAuthenticationResponse,
    noContent: baseNoContent,
    notFound: baseNotFound,
    permissionResponse,
    success: baseSuccess,
    unauthorized: baseAuthorizationResponse,
    validationResponse,
}
