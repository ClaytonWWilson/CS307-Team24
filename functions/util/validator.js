const isEmail = (str) => {
  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (str.match(emailRegEx)) return true;
  else return false;
};

const isEmpty = (str) => {
  if (str.trim() === "") return true;
  else return false;
};

exports.validateUpdateProfileInfo = (data) => {
  let errors = {};
  let profileData = {};

  // ?: Should users be able to change their handles and emails?

  // Only adds the key to the database if the values are not empty
  if (!isEmpty(data.firstName)) profileData.firstName = data.firstName.trim();
  if (!isEmpty(data.lastName)) profileData.lastName = data.lastName.trim();
  if (!isEmpty(data.bio)) profileData.bio = data.bio.trim();

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty.";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email.";
  } else {
    profileData.email = data.email;
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
    profileData
  };
};
