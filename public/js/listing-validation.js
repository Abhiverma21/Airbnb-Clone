function validateForm(event) {
    const form = event.target;
    const title = form.querySelector('input[name="listing[title]"]');
    const description = form.querySelector('textarea[name="listing[description]"]');
    const image = form.querySelector('input[name="image"]');
    const price = form.querySelector('input[name="listing[price]"]');
    const location = form.querySelector('input[name="listing[location]"]');
    const country = form.querySelector('input[name="listing[country]"]');

    // Reset previous validation state
    form.classList.remove('was-validated');
    
    let isValid = true;

    // Validate title
    if (!title.value || title.value.length < 5) {
        title.setCustomValidity('Title must be at least 5 characters long');
        isValid = false;
    } else {
        title.setCustomValidity('');
    }

    // Validate description
    if (!description.value || description.value.length < 10) {
        description.setCustomValidity('Description must be at least 10 characters long');
        isValid = false;
    } else {
        description.setCustomValidity('');
    }

    // Validate image
    if (!image.files || !image.files[0]) {
        image.setCustomValidity('Please select an image file');
        isValid = false;
    } else {
        const file = image.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            image.setCustomValidity('Please select a valid image file (JPG or PNG)');
            isValid = false;
        } else {
            image.setCustomValidity('');
        }
    }

    // Validate price
    if (!price.value || price.value <= 0) {
        price.setCustomValidity('Please enter a valid price');
        isValid = false;
    } else {
        price.setCustomValidity('');
    }

    // Validate location
    if (!location.value || location.value.length < 2) {
        location.setCustomValidity('Please enter a valid location');
        isValid = false;
    } else {
        location.setCustomValidity('');
    }

    // Validate country
    if (!country.value || country.value.length < 2) {
        country.setCustomValidity('Please enter a valid country');
        isValid = false;
    } else {
        country.setCustomValidity('');
    }

    form.classList.add('was-validated');

    if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
    }

    return isValid;
}