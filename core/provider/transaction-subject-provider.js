
const subjectUtil = require('../util/subject-util')


this._validate_post_transaction_subject
this._validate_get_transaction_subject
this._insert_transaction_subject
this._create_filter_transaction_subject
this._enrich_transaction_subject
this._enrich_transaction_list_subject
this._find_transaction_subject




// this._validation_create_subject
// this._validation_create_result_subject
// this._validation_query_subject
// this._validation_query_result_subject

// this._service_create_subject
// this._service_create_result_subject
// this._service_query_subject
// this._service_query_result_subject

// this._repository_create_subject
// this._repository_create_result_subject
// this._repository_query_subject
// this._repository_query_result_subject

module.exports = {
    validatePost: function() {
        this._validate_post_transaction_subject = subjectUtil.initSubject(this._validate_post_transaction_subject)
        return this._validate_post_transaction_subject
    },
    validateGet: function() {
        this._validate_get_transaction_subject = subjectUtil.initSubject(this._validate_get_transaction_subject)
        return this._validate_get_transaction_subject
    },
    insert: function() {
        this._insert_transaction_subject = subjectUtil.initSubject(this._insert_transaction_subject)
        return this._insert_transaction_subject
    },
    enrich: function() {
        this._enrich_transaction_subject = subjectUtil.initSubject(this._enrich_transaction_subject)
        return this._enrich_transaction_subject
    },
    enrichList: function() {
        this._enrich_transaction_list_subject = subjectUtil.initSubject(this._enrich_transaction_list_subject)
        return this._enrich_transaction_list_subject
    },
    createFilter: function() {
        this._create_filter_transaction_subject = subjectUtil.initSubject(this._create_filter_transaction_subject)
        return this._create_filter_transaction_subject
    },
    find: function() {
        this._find_transaction_subject = subjectUtil.initSubject(this._find_transaction_subject)
        return this._find_transaction_subject
    }
}




// exports.validation = {
//     create: function() {
//         this._validation_create_subject = subjectUtil.initSubject(this._validation_create_subject)
//         return this._validation_create_subject
//     },
//     createResult: function() {
//         this._validation_create_result_subject = subjectUtil.initSubject(this._validation_create_result_subject)
//         return this._validation_create_result_subject
//     },
//     query: function() {
//         this._validation_query_subject = subjectUtil.initSubject(this._validation_query_subject)
//         return this._validation_query_subject
//     },
//     queryResult: function() {
//         this._validation_query_result_subject = subjectUtil.initSubject(this._validation_query_result_subject)
//         return this._validation_query_result_subject
//     }
// }

// exports.service = {
//     create: function() {
//         this._service_create_subject = subjectUtil.initSubject(this._service_create_subject)
//         return this._service_create_subject
//     },
//     createResult: function() {
//         this._service_create_result_subject = subjectUtil.initSubject(this._service_create_result_subject)
//         return this._service_create_result_subject
//     },
//     query: function() {
//         this._service_query_subject = subjectUtil.initSubject(this._service_query_subject)
//         return this._service_query_subject
//     },
//     queryResult: function() {
//         this._service_query_result_subject = subjectUtil.initSubject(this._service_query_result_subject)
//         return this._service_query_result_subject
//     }
// }

// exports.repository = {
//     create: function() {
//         this._repository_create_subject = subjectUtil.initSubject(this._repository_create_subject)
//         return this._repository_create_subject
//     },
//     createResult: function() {
//         this._repository_create_result_subject = subjectUtil.initSubject(this._repository_create_result_subject)
//         return this._repository_create_result_subject
//     },
//     query: function() {
//         this._repository_query_subject = subjectUtil.initSubject(this._repository_query_subject)
//         return this._repository_query_subject
//     },
//     queryResult: function() {
//         this._repository_query_result_subject = subjectUtil.initSubject(this._repository_query_result_subject)
//         return this._repository_query_result_subject
//     }
// }