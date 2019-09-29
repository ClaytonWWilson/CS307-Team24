const isEmpty = (str) => {
    if (str.trim() === '') return true;
    else return false;
};

exports.validateUpdateProfileInfo = (profileData) => {
    let errors = {}

    if (isEmpty(profileData.email)) {
        errors.email = "Must not be empty.";
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};