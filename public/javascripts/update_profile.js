const submit = document.querySelector('#submit');

submit.addEventListener('click', (event) => {
  event.preventDefault();
  const formData = {};
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const firstName = document.querySelector('#first_name').value;
  const lastName = document.querySelector('#last_name').value;
  const passwordConfirmation = document.querySelector('#password_confirmation')
    .value;
  formData.email = email;
  formData.password = password;
  formData.first_name = firstName;
  formData.last_name = lastName;
  if (!checkInputData(formData)) {
    showErrorMsg('Please fill in all fields before submitting!', 'info');
    return;
  }
  if (passwordConfirmation != password) {
    showErrorMsg('Password not match!', 'danger');
    return;
  }
  // check email exists
  checkEmailExists({ email: email }, formData);
});

const postRegisterData = async (formData) => {
  fetch('/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        window.location = '/profile';
      } else {
        showErrorMsg('Something went wrong', 'secondary');
      }
    })
    .catch(() => {
      console.error('Error');
    });
};

const getCurrentUserProfile = async () => {
  const res = await fetch('/myProfile');
  const data = await res.json();
  return data;
};

const checkEmailExists = async (email, formData) => {
  const user = await getCurrentUserProfile();
  const cur_email = user.email;
  const is_modified_email = !(
    email.email.toLowerCase() === cur_email.toLowerCase()
  );
  fetch('/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(email),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.exist && is_modified_email) {
        showErrorMsg('This email has already been used!', 'warning');
      } else {
        postRegisterData(formData);
      }
    })
    .catch(() => {
      return false;
    });
};

const checkInputData = (formData) => {
  for (const key in formData) {
    if (!formData[key]) return false;
  }
  return true;
};

const showErrorMsg = (msg, color) => {
  const errorDiv = document.querySelector('#errrorMessage');
  errorDiv.innerHTML = '';
  errorDiv.innerHTML = `<div class="alert alert-${color} fade show"  role="alert"> 
     <strong>${msg}</strong> Please try again </div>
     `;
};

const fillInfo = async () => {
  const user = await getCurrentUserProfile();
  const firstName = document.querySelector('#first_name');
  firstName.value = user.first_name;
  const lastName = document.querySelector('#last_name');
  lastName.value = user.last_name;
  const email = document.querySelector('#email');
  email.value = user.email;
};

fillInfo();
