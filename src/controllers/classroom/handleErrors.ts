if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

interface Form {
	name: string;
	title: string;
}

interface Errors {
	name: string;
	title: string;
}

// handle errors
async function handleErrors(
	err: {
		message: string;
		code: number;
		_message: string;
		keyValue: {
			name?: string;
			title?: string;
		};
	},
	Form?: Form,
) {
	console.log('Error when creating classroom', err.message);
	// @ts-ignore
	let errors: Errors = {};

	if (err.message == 'Only Letters and Numbers are allowed') {
		errors.name = err.message;
	}

	// @ts-ignore
	// console.log(err.keyValue);

	// duplicate name error
	if (err.code === 11000 && err.keyValue.name) {
		errors.name = 'that name is already registered';
	}

	// console.log(errors, err);

	// validation errors
	if (err._message) {
		// console.log(err);

		// @ts-ignore
		Object.values(err.errors).forEach(({ properties }) => {
			// console.log(val);
			// console.log(properties);
			console.log(properties.path);
			if (properties.message != '') {
				// @ts-ignore
				errors[properties.path] = properties.message;
			}
		});
	}

	return errors;
}

export default handleErrors;
