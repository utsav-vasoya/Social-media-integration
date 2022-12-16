const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    id: {
        type: String
    },
    email: {
        type: String
    },
    image: {
        type: String
    },
    login_type: {
        type: String
    },
    display_name: {
        type: String
    },
    password: {
        type: String
    }
});
const User = mongoose.model("User", UserSchema);
module.exports = User;