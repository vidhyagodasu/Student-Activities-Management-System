const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    Sno: {
        type: Number,
    },
    Title_of_the_collaborative_activity : {
        type : String,
    },
    Name_of_the_collaborating_agency_with_contact_details : {
        type : String,
    },
    Name_of_the_participant : {
        type : String,
    },
    Year_of_Collaboration : {
        type : Number,
    },
    Duration : {
        type : String,
    },
    Nature_of_the_activity : {
        type : String,
    },
    Department : {
        type : String,
    },
    Academic_Year : {
        type : String,
    },

    Student_Name : {
        type : String,
    },
    Award: {
        type : String,
    },
    Awarding_government : {
        type : String,
    },
    Year_of_Award : {
        type : String,
    },
    Department_1 : {
        type : String,
    },
    Academic_Year1 : {
        type : String,
    },
},
{
    versionKey: false
});

const UserModel = mongoose.model("users2",UserSchema)
module.exports = UserModel;