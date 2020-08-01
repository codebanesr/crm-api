import mongoose from "mongoose";
const dispositionSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign'
    },

    options: [{
        title: String,
        key: String,
        expanded: Boolean,
        children: [
            {
                title: String,
                key: String,
                isLeaf: Boolean,
                children: [{}]
            }
        ]
    }]
}, {
        timestamps: true,
        autoIndex: true,
        strict: false
});

export default mongoose.model("Disposition", dispositionSchema);