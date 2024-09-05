import mongoose from './index.js';
import validators from '../Utils/validators.js';
import generateUUID from '../Utils/helper.js';

const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: function () {
                return generateUUID();
            }
        },
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            validate: {
                validator: validators.validateEmail,
                message: props=>`${props.value} is not a valid email`
            }
        },
        password: {
            type: String,
            required: [true, "Password is required!"]
        },
        random: {
            type: String,
            default: undefined
        },
        tokenExpiry: {
            type: Date,
            default: undefined
        }
    },
    {
        collection: 'users',
        versionKey: false
    }
)

export default mongoose.model('users', userSchema)