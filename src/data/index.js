// DEFAULT PORT
const PORT_NUMBER = 9898

// PATH
const paths = {
  auth: '/api/auth',
  user: '/api/user',
  coll: '/api/collection',
  blog: '/api/blog',
  comm: '/api/comment',
  404: '/*'
}

// REGEX
const regexes = {
  name: /^[a-z ,.'-]+$/i,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/g
}

// ROLES ENUm
const ROLES = {
  member: 'MEMBER',
  admin: 'ADMIN'
}

module.exports = { PORT_NUMBER, paths, regexes, ROLES }
