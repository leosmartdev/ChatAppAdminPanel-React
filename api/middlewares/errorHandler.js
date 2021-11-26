const errorHandler = (err, req, res, next) => {
	// declare variable for store the error message
	let error = err.message;

	// Mongoose bad objectId
	if(err.name === 'CastError') {
		error = `Resource not found with id of ${err.value}`
	}
	
	// output
	res.status(500).json({
		success: false,
		message: error
	});
	next();
}

module.exports = errorHandler;