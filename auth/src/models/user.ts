import { InferSchemaType, Schema, model, Document, Model } from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
    email: string;
    password: string;
}

interface UserModel extends Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

interface UserDoc extends Document {
    email: string;
    password: string;
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        requires: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    }
}, {
    toJSON: {
        versionKey: false,
        transform: function (doc, ret) {
            delete ret.password;
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed)
    }
    done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}
const User = model<UserDoc, UserModel>('User', userSchema);

export { User }
