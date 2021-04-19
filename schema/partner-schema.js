const mongoose = require('mongoose')

const reqString = {
	type: String,
	require: true,
}

const partnerSchema = mongoose.Schema(
	{
		guildId: reqString,
		userId: reqString,
		currentPartner: String,
		currentMarry: String,
		partners: Array,
		// [
		// {
		//     name: reqString,
		//     xp: {
		//         type: Number,
		//         default: 0
		//     },
		//     affectionLvl: {
		//         type: Number,
		//         default: 1
		//     },
		//     copies: {
		//         type: Number,
		//         default: 0
		//     },
		//     ascension: {
		//         type: Number,
		//         default: 1
		//     }
		// }
		// ]
		pokeRegen: {
			type: Date,
			required: true,
		},
		marryRegen: {
			type: Date,
			required: true,
		},
		pokeTimes: {
			type: Number,
			default: 3,
		},
		availability: {
			type: Boolean,
			default: true,
			require: true,
		},
	},
	{
		timestamps: true,
	},
)

module.exports = mongoose.model('partner', partnerSchema)

//push into new arr mongoose
// var objFriends = { fname:"fname",lname:"lname",surname:"surname" };
// Friend.findOneAndUpdate(
//    { _id: req.body.id },
//    { $push: { friends: objFriends  } },
//   function (error, success) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(success);
//         }
//     });
// )

//update values in arr mongoose
// {
//     _id: 1,
//     name: 'John Smith',
//     items: [{
//        id: 1,
//        name: 'item 1',
//        value: 'one'
//     },{
//        id: 2,
//        name: 'item 2',
//        value: 'two'
//     }]
//   }
//   Person.update({'items.id': 2}, {'$set': {
//     'items.$.name': 'updated item2',
//     'items.$.value': 'two updated'
// }}, function(err) { ...})
