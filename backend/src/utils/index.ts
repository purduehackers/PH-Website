export const successRes = (res, response) => res.json({ status: 200, response });

export const errorRes = (res, status, error) =>
	res.status(status).json({
		status,
		error
	});
