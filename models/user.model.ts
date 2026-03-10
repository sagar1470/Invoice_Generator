import mongoose from "mongoose";

interface Iuser {
    _id? : mongoose.Types.ObjectId,
    firstName: string;
    lastName: string;
    email: string;
    emailVerified : Date;
    currency: string;
    cratedAt? : Date;
    updatedAt? : Date;
}

const userSchema = new mongoose.Schema<Iuser>({
    firstName : { type : String, default : null},
    lastName : { type : String, default: null},
    email : { type: String, required: true, unique: true},
    emailVerified: {type: Date, required: true, default: null},
    currency : {type: String, default: "USD"}
},{
    timestamps: true
})

const UserModel = mongoose.models.user || mongoose.model('user', userSchema)

export default UserModel;