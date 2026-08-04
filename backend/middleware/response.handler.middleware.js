export const responseHandler = (req, res, next) => {

    res.success = ({
        statusCode = 200,
        message = "Success",
        data = null
    }) => {

        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    };

    res.fail = ({
        statusCode = 400,
        message = "Failed",
        error = null
    }) => {

        return res.status(statusCode).json({
            success: false,
            message,
            error
        });
    };

    next();
};