const resourceType = {
    TRANSACTION: 'transaction'
}

const status = {
    FAILED: 'failed',
    IN_PROGRESS: 'in_progress',
    SUCCESS: 'successful'
}

Object.freeze(resourceType)
Object.freeze(status)

module.exports = { resourceType, status }