
const mysql=require("mysql");

const jwt=require("jsonwebtoken");

const bcrypt=require("bcryptjs");

const db=mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

exports.login =async(req, res)=>{
    console.log(req.body);
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).send({
                message: 'please provide an email and password'
            })
        }

        db.query('SELECT * from users where email = ?', [email], async(error , results ) => {
            console.log(results);
            if(!results.length || !(await bcrypt.compare(password, results[0].password)))
            res.status(400).send({
                message: 'incorrect email or password'
            })
            else{
                res.status(200).send({message:"Login Approved"});
            }
        })

    } catch (error) {
        console.log(error);
    }
}


exports.register = (req,res) =>{
    console.log("Request Recieved for : ", req.body);
    
    const{name, email, mobile, password, confirmpassword} =req.body;

    db.query('SELECT email from users where email=?',[email],async(error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length > 0) {
            return res.send({
                message: 'email is alreay registered'
            })
        } else if(password != confirmpassword) {
            return res.send({
                message: 'password do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password,8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, email: email,mobile_number: mobile, password: hashedPassword}, (error,results) => {})
            if(error){
                console.log(error);
            } else{
                console.log(results);
                return res.send({
                    message: 'user registered'
                })  
            }

    });

}