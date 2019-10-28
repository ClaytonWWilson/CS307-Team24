const isEmail = (str) => {
  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (str.match(emailRegEx)) return true;
  else return false;
};

const isEmpty = (str) => {
  if (str.trim() === "") return true;
  else return false;
};

exports.validateUpdateProfileInfo = (req) => {
  const newData = req.body;
  // const oldData = req.userData;
  let errors = {};
  let profileData = req.userData;

  // ?: Should users be able to change their handles and emails?

  // Deletes any unused keys so that they aren't stored in the database
  if (newData.firstName) {
    profileData.firstName = newData.firstName.toString().trim();
  } else {
    delete profileData.firstName;
  }

  if (newData.lastName) {
    profileData.lastName = newData.lastName.toString().trim();
  } else {
    delete profileData.lastName;
  }

  if (newData.bio) {
    profileData.bio = newData.bio.toString().trim();
  } else {
    delete profileData.bio;
  }

  if (isEmpty(newData.email)) {
    errors.email = "Must not be empty.";
  } else if (!isEmail(newData.email)) {
    errors.email = "Must be a valid email.";
  } else {
    profileData.email = newData.email;
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
    profileData
  };
};
