const knex = require('../../db/knex');
const uuidV4 = require('uuid/v4');

exports.signup = (req, res, next) => {
   
    if(!req.body.name || !req.body.email || !req.body.mobile 
        || !req.body.city || !req.body.country)
        return res.status(400).json({
            status: "error",
            error: "Missing input parameter(s) : name, email, password, mobile, city, country"
        });

    knex.select()
    .from('user')
    .where('email', req.body.email)
    .then(result => {
        if(!result.length > 0)
        {
            knex('user').insert({
                id: uuidV4(),
                name: req.body.name,
                email:  req.body.email,
                password: req.body.password,
                mobile: req.body.mobile,
                city: req.body.city,
                country: req.body.country,
                created_at: new Date(),
                updated_at: new Date()
            })
            .then(() => {
                knex.select(['id', 'name', 'email', 'mobile', 'city', 'country', 'created_at'])
                    .from('user')
                    .where('email', req.body.email)
                    .then(result => {
                        return res.status(200).json({
                            status: "success",
                            user: result[0]
                        });
                    })
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json({
                    status: "error",
                    error: err
                });
            })
        }
        else
        {
            return res.status(400).json({
                status: "error",
                error: "Email already exists! Please login to continue!"
            }); 
        }
    })    
   
};

exports.login = (req, res, next) => {
    if(!req.body.email || !req.body.password)
        return res.status(400).json({
            status: "error",
            error: "Missing input parameter(s) : email, password"
        });
    
    knex.select(['id', 'name', 'email', 'mobile', 'city', 'country', 'created_at'])
        .from('user')
        .where({email: req.body.email, password: req.body.password})
        .then(result => {
            if(!result.length > 0)
            {
                return res.status(400).json({
                    status: "error",
                    error: "Please enter valid credentials!"
                });
            }
            else
            {
                return res.status(200).json({
                    status: "success",
                    user: result[0]
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                status: "error",
                error: err
            });
        })
};

exports.userList = (req, res, next) => {
    //const id = req.params.noteId;
    knex.select(['id', 'name', 'email', 'mobile', 'city', 'country', 'created_at'])
        .from('user')
        .then( result => {
            if(result.length >= 0) {
                return res.status(200).json({
                    status: "success",
                    users: result
                });
            } else {
                return res.status(400).json({
                    status: "error",
                    error: "No result found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                status: "error",
                error: err
            });
        })
};






