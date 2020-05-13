const resourceType = {
    TRANSACTION: 'transaction'
}

const status = {
    FAILED: 'failed',
    PENDING: 'pending',
    SUCCESS: 'successful'
}

Object.freeze(resourceType)
Object.freeze(status)

module.exports = { resourceType, status }