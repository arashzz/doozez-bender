const subjectUtil = require('../util/subject-util')

this._create_subject
this._update_subject

exports.createSubject = function() {
    this._create_subject = subjectUtil.initSubject(this._create_subject)
    return this._create_subject
}

exports.updateSubject = function() {
    this._update_subject = subjectUtil.initSubject(this._update_subject)
    return this._update_subject
}