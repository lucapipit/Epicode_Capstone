const isValidAuthor = (req, res, next) => {

    const errors = [];
    const  {name, surname, email, password, dob, avatar, authorImg} = req.body;
    const allowedImages = [".jpg", ".png", "jpeg"];
    const validEmail = ()=>{return email.includes("@")};

    if(typeof name !== "string" || typeof surname !== "string"){
        errors.push("name and surname must be a string!")
    }
    if(!validEmail()){
        errors.push("inserire email valida")
    }
    if(password.length < 8){
        errors.push("password length must be longer than 8 characters")
    }
    if(!allowedImages.some(ext => authorImg.endsWith(ext))){
        errors.push("image must be a jpg or a png")
    }
    if(errors.length > 0){
        res.status(400).json({errors})
    }else{
        next()
    }
}

module.exports = isValidAuthor