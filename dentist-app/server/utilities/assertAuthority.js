// An assertion method to configure the authority of an admin
const assertAdmin = (req,res, next) => {
    if(!req.user.admin) {
        return res.status(403).json({ Message: "Don't act like an admin!!"})
    }
    next();
}

//An assertion method to configure the authority of a personal account
const assertPersonal = (req, res, next) => {
    if(req.user._id == req.params.id) {
        return next();
    }
    return res.status(403).json({ Message: "Good try but our system is not that easy to hack!!"})
}

//An assertion method to configure the authority of a dentist account
const assertDentist = (req, res, next) => {
    if(req.dentist._id == req.params.id) {
        return next();
    }
    return res.status(403).json({ Message: "I mean it's illegal to fraud to be a doctor."})
}

module.exports = {assertAdmin, assertDentist, assertPersonal};