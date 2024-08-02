### New version of TECH-BUUDY

### create routes directories

in it create an api directories
create users.js- handles registering users,add users
auth.js-gets json webtoken for auth
profiles.js- handles creating profiles, adding them, updating them, deleting them
posts.js- creates forms areas where we can like posts, comment on them

### create models

1st User model
include name username password data
type: string, date
required: true
unique: true

### create user modle

see if user exist
grab user gravater
return jsonwebntoken usign bcrypt

### bcrypt

create a salt

### create middleware

create auth.js that takes in req, res,next

### login user

login user and use bycrypt to compare password inputed and the actual password stored

### Create profile model

Creating a schema for
user,
company,
website
social-youtube, x, facebook, linkedin
experience,
education

### AI integration, Promt engineering, AI assimulation
