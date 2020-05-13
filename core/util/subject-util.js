const Rx = require('rxjs')

exports.initSubject = function(subject) {
    if(!subject) {
        subject = new Rx.Subject()
    }
    return subject
}