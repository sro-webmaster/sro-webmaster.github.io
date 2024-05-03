const SO = {

  minImageSize: 1500,
  scriptURL: 'https://script.google.com/macros/s/AKfycbzFuOF52S2wytR22_zJtS8DjQ26Vg1Rnk9uFbDfqIkTShMGAhnurOWigrn38Tuqlo9BFg/exec',
  confirmationMessage: 'Your shout-out has been successfully submitted! Thank you and we can\'t wait to see you at the show!',
  errorMessage: 'There was a problem submitting your shout-out. We apologize for the inconvenience. Please refresh this page and try again. If for some reason it still doesn\'t work, please email Toby Varland at <a class="decoration-2 underline decoration-sky-600" href="mailto:design@sroinc.org?subject=Shout-Out%20Submission%20Not%20Working">design@sroinc.org</a> and let him know.',
  loadingMessage: 'Please wait while we process your shout-out. This may take a few moments. Please don\'t close or refresh this page (or hit the back button).',

  form: null,
  formContent: null,
  purchaserNameInput: null,
  purchaserEmailInput: null,
  studentNameInput: null,
  textInput: null,
  fileInput: null,
  purchaserNameError: null,
  emailError: null,
  nameError: null,
  textError: null,
  fileError: null,
  submitButton: null,
  uploadedFile: null,
  fileReader: null,
  imageObject: null,
  formData: null,
  loadingContainer: null,

  init: function() {
    SO.buildReferences();
    SO.configureFileReader();
    SO.configureImageObject();
    SO.configureSubmitHandler();
  },

  configureFileReader: function() {
    SO.fileReader = new FileReader();
    SO.fileReader.addEventListener('loadend', SO.handleFileRead);
  },

  handleFileRead: function() {
    SO.imageObject.src = SO.fileReader.result;
  },

  configureImageObject: function() {
    SO.imageObject = new Image();
    SO.imageObject.addEventListener('load', SO.handleImageLoad);
  },

  handleImageLoad: function() {
    let lesserDimension = SO.imageObject.width < SO.imageObject.height ? SO.imageObject.width : SO.imageObject.height;
    if (lesserDimension < SO.minImageSize) {
      SO.showError(`The image must be at least ${SO.minImageSize.toLocaleString()}px on the short side. The image you uploaded was only ${lesserDimension.toLocaleString()}px on the short side.`, SO.fileError);
      SO.enableControls();
      return;
    }
    SO.submitInBackground();
  },

  submitInBackground: function() {
    SO.setLoadingState();
    SO.formData = new FormData();
    SO.formData.append('purchaserName', SO.purchaserNameInput.value);
    SO.formData.append('purchaserEmail', SO.purchaserEmailInput.value);
    SO.formData.append('studentName', SO.studentNameInput.value);
    SO.formData.append('shoutOutText', SO.textInput.value);
    SO.formData.append('encodedFile', SO.fileReader.result);
    SO.formData.append('mimeType', SO.uploadedFile.type);
    fetch(SO.scriptURL, {
      method: 'POST',
      body: SO.formData,
    })
    .then(response => response.json())
    .then(data => SO.showConfirmation())
    .catch((error) => SO.showSubmissionError());
  },

  showConfirmation: function() {
    let confirmation = document.createElement('div');
    confirmation.classList.add('my-12', 'text-2xl', 'text-center', 'text-balance', 'font-light', 'leading-snug');
    confirmation.textContent = SO.confirmationMessage;
    SO.form.appendChild(confirmation);
    SO.loadingContainer.remove();
  },

  showSubmissionError: function() {
    let error = document.createElement('div');
    error.classList.add('my-12', 'text-2xl', 'text-center', 'text-balance', 'text-red-500', 'leading-snug');
    error.innerHTML = SO.errorMessage;
    SO.form.appendChild(error);
    SO.loadingContainer.remove();
  },

  setLoadingState: function() {
    SO.formContent.classList.add('hidden');
    let spinner = document.createElement('div');
    spinner.classList.add('w-12', 'h-12', 'bg-sky-600', 'animate-bounce', 'rounded-full');
    let loadingMessage = document.createElement('div');
    loadingMessage.classList.add('text-2xl', 'text-center', 'text-balance', 'font-light', 'leading-snug');
    loadingMessage.textContent = SO.loadingMessage;
    SO.loadingContainer = document.createElement('div');
    SO.loadingContainer.classList.add('my-12', 'flex', 'flex-col', 'justify-center', 'items-center', 'gap-4');
    SO.loadingContainer.appendChild(spinner);
    SO.loadingContainer.appendChild(loadingMessage);
    SO.form.appendChild(SO.loadingContainer);
  },

  buildReferences: function() {
    SO.form = document.getElementById('shout-out-form');
    SO.formContent = document.getElementById('form-content');
    SO.purchaserNameInput = document.getElementById('purchaser-name');
    SO.purchaserEmailInput = document.getElementById('purchaser-email');
    SO.studentNameInput = document.getElementById('student-name');
    SO.textInput = document.getElementById('text');
    SO.fileInput = document.getElementById('file');
    SO.purchaserNameError = document.getElementById('purchaser-name-error');
    SO.emailError = document.getElementById('email-error');
    SO.nameError = document.getElementById('name-error');
    SO.textError = document.getElementById('text-error');
    SO.fileError = document.getElementById('file-error');
    SO.submitButton = document.getElementById('submit-button');
  },

  configureSubmitHandler: function() {
    SO.form.addEventListener('submit', function(event) {
      event.preventDefault();
      SO.handleSubmission();
    });
  },

  handleSubmission: function() {
    SO.clearAndHideErrors();
    SO.disableControls();
    if (SO.validateForm()) {
      SO.fileReader.readAsDataURL(SO.uploadedFile);
    } else {
      SO.enableControls();
    }
  },

  clearAndHideErrors: function() {
    SO.purchaserNameError.textContent = '';
    SO.emailError.textContent = '';
    SO.nameError.textContent = '';
    SO.textError.textContent = '';
    SO.fileError.textContent = '';
    SO.purchaserNameError.classList.add('hidden');
    SO.emailError.classList.add('hidden');
    SO.nameError.classList.add('hidden');
    SO.textError.classList.add('hidden');
    SO.fileError.classList.add('hidden');
  },

  disableControls: function() {
    SO.purchaserNameInput.disabled = true;
    SO.purchaserEmailInput.disabled = true;
    SO.studentNameInput.disabled = true;
    SO.textInput.disabled = true;
    SO.fileInput.disabled = true;
    SO.submitButton.disabled = true;
  },

  enableControls: function() {
    SO.purchaserNameInput.disabled = false;
    SO.purchaserEmailInput.disabled = false;
    SO.studentNameInput.disabled = false;
    SO.textInput.disabled = false;
    SO.fileInput.disabled = false;
    SO.submitButton.disabled = false;
  },

  showError: function(message, element) {
    element.textContent = message;
    element.classList.remove('hidden');
    return false;
  },

  validateForm: function() {
    if (SO.purchaserNameInput.value.trim() === '') return SO.showError('Please enter the purchaser name.', SO.purchaserNameError);
    if (SO.purchaserEmailInput.value.trim() === '') return SO.showError('Please enter the purchaser email address.', SO.emailError);
    if (SO.studentNameInput.value.trim() === '') return SO.showError('Please enter the student name(s).', SO.nameError);
    if (SO.textInput.value.trim() === '') return SO.showError('Please enter the shout-out text.', SO.textError);
    if (SO.fileInput.files.length === 0) return SO.showError('Please select a photo for the shout-out.', SO.fileError);
    SO.uploadedFile = SO.fileInput.files[0];
    if (!SO.uploadedFile.type.startsWith('image/')) return SO.showError('This form only accepts image files.', SO.fileError);
    return true;
  }

};

window.addEventListener('load', function() {
  SO.init();
});