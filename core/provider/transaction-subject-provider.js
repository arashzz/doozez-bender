
const subjectUtil = require('../util/subject-util')


this._validation_subject
this._validated_subject
this._create_subject
this._create_result_subject

exports.validationSubject = function() {
    this._validation_subject = subjectUtil.initSubject(this._validation_subject)
    return this._validation_subject
}

exports.validatedSubject = function() {
    this._validated_subject = subjectUtil.initSubject(this._validated_subject)
    return this._validated_subject
}

exports.createSubject = function() {
    this._create_subject = subjectUtil.initSubject(this._create_subject)
    return this._create_subject
}

exports.createResultSubject = function() {
    this._create_result_subject = subjectUtil.initSubject(this._create_result_subject)
    return this._create_result_subject
}
