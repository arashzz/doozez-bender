const { RESOLVER, Lifetime, InjectionMode } = require('awilix'),
    Rx = require('rxjs')

let transaction_validate_post
let transaction_validate_get
let transaction_insert
let transaction_create_filter
let transaction_enrich
let transaction_enrich_list
let transaction_find

let job_create
let job_run_task
let job_updateResult
let job_update
let test

class SubjectProvider {
    constructor({ logger }) {
        this.namespace = 'core.provider.subject-provider'

        test = new Rx.Subject()
        transaction_validate_post = new Rx.Subject()
        transaction_validate_get = new Rx.Subject()
        transaction_insert = new Rx.Subject()
        transaction_create_filter = new Rx.Subject()
        transaction_enrich = new Rx.Subject()
        transaction_enrich_list = new Rx.Subject()
        transaction_find = new Rx.Subject()

        job_create = new Rx.Subject()
        job_run_task = new Rx.Subject()
        job_updateResult = new Rx.Subject()
        job_update = new Rx.Subject()
        logger.log('debug', '<%s> all subjects are initialized', this.namespace)
    }
    transaction = {
        validatePost: function() {
            return transaction_validate_post
        },
        validateGet: function() {
            return transaction_validate_get
        },
        insert: function() {
            return transaction_insert
        },
        enrich: function() {
            return transaction_enrich
        },
        enrichList: function() {
            return transaction_enrich_list
        },
        createFilter: function() {
            return transaction_create_filter
        },
        find: function() {
            return transaction_find
        }
    }
    job = {
        create: function() {
            return job_create
        },
        runTask: function() {
            return job_run_task
        },
        updateResult: function() {
            return job_updateResult
        },
        update: function() {
            return job_update
        }
    }
}

module.exports = SubjectProvider

SubjectProvider[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}