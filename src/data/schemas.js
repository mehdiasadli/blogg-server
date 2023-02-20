const yup = require('yup')
const { regexes } = require('./index')

// Login Schema
const signinSchema = yup.object({
  body: yup.object({
    username: yup
      .string()
      .required('Username is required')
      .transform((value) => value.replace(/ /g, ''))
      .lowercase(),
    password: yup.string().required('Password is required')
  })
})

// Register Schema
const signupSchema = yup.object({
  body: yup.object({
    firstName: yup
      .string()
      .required('First Name is required')
      .transform((value) => value.charAt(0).toUpperCase() + value.substring(1)),
    lastName: yup
      .string()
      .required('Last Name is required')
      .transform((value) => value.charAt(0).toUpperCase() + value.substring(1)),
    username: yup
      .string()
      .required('Username is required')
      .transform((value) => value.replace(/ /g, ''))
      .lowercase(),
    password: yup
      .string()
      .required('Password is required')
      .min(7, 'Password must contain at least 7 characters')
      .max(20, 'Password can contain maximum 20 characters')
      .matches(
        regexes.password,
        'Password must start with an uppercase letter, and it must include a lowercase letter and a number'
      )
  })
})

// Get User Schema
const getUserSchema = yup.object({
  body: yup.object({
    firstName: yup.string(),
    lastName: yup.string()
  })
})

// Edit Image Schema
const editImageSchema = yup.object({
  body: yup.object({
    image: yup.string().required('Image is required')
  })
})

// Create Post Schema
const addCollectionSchema = yup.object({
  body: yup.object({
    content: yup.string().required('Post content is required')
  })
})

// Create Blog Schema
const createBlogSchema = yup.object({
  body: yup.object({
    title: yup.string().required('Blog title is required'),
    content: yup.string().required('Blog content is required')
  })
})

module.exports = {
  signinSchema,
  signupSchema,
  getUserSchema,
  addCollectionSchema,
  createBlogSchema,
  editImageSchema
}
