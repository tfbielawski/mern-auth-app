import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },

},{timestamps: true});


userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//"this" refers to the user.create or .save action
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        next();
    }

    //create the hashing key
    const salt = await bcrypt.genSalt(10);
    //becrypt hashes the pass using the salt as key, assign to password
    this.password = await bcrypt.hash(this.password, salt);
})


const User = mongoose.model("User", userSchema);

export default User;