// import { validationResult } from 'express-validator';

// const validateRequest = (req, res, next) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       errors: errors.array().map(err => ({
//         field: err.param,
//         message: err.msg,
//       })),
//     });
//   }

//   next();
// };

// export default validateRequest;


import { validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      // return both keys so frontend can read either
      path: err.path || err.param,
      param: err.param || err.path,
      msg: err.msg,
      field: err.param || err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export default validateRequest;
