const subjectUtil = require('../util/subject-util')

this._create_job_subject
this._run_task_subject
this._updateResult_job_subject
this._update_job_subject

module.exports = {
    create: function() {
        this._create_job_subject = subjectUtil.initSubject(this._create_job_subject)
        return this._create_job_subject
    },
    runTask: function() {
        this._run_task_subject = subjectUtil.initSubject(this._run_task_subject)
        return this._run_task_subject
    },
    updateResult: function() {
        this._updateResult_job_subject = subjectUtil.initSubject(this._updateResult_job_subject)
        return this._updateResult_job_subject
    },
    update: function() {
        this._update_job_subject = subjectUtil.initSubject(this._update_job_subject)
        return this._update_job_subject
    }
}