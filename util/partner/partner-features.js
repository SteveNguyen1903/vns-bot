const partnerSchema = require('@schema/partner-schema')
const fs = require('fs')
const path = require('path')

//main
const checkPartner = async (guildId, userId) => {
	const result = await partnerSchema.findOne({ guildId, userId })
	return result
}

const gachaGame = (weight = [3, 10, 87]) => {
	let total = weight.reduce((a, b) => a + b)
	let result = Math.random()
	let tempChance = []
	weight.forEach((item) => {
		tempChance.push(item / total)
	})
	let count = 0
	for (let i = 0; i < tempChance.length; i++) {
		count += tempChance[i]
		if (count >= result) return i
	}
}

const promiseAllP = (items, block) => {
	var promises = []
	items.forEach(function (item, index) {
		promises.push(
			(function (item, i) {
				return new Promise(function (resolve, reject) {
					return block.apply(this, [item, index, resolve, reject])
				})
			})(item, index),
		)
	})
	return Promise.all(promises)
}

/**
 * read files
 * @param dirname string
 * @return Promise
 */
const readFiles = (dirname) => {
	return new Promise((resolve, reject) => {
		fs.readdir(dirname, function (err, filenames) {
			if (err) return reject(err)
			promiseAllP(filenames, (filename, index, resolve, reject) => {
				fs.readFile(path.resolve(dirname, filename), 'utf-8', function (err, content) {
					if (err) return reject(err)
					// return resolve({ filename: filename, contents: content })
					return resolve({ content })
				})
			})
				.then((results) => {
					return resolve(results)
				})
				.catch((error) => {
					return reject(error)
				})
		})
	})
}

const getListCharacters = async () => {
	const res = await readFiles('./json/partner')
	let arr = []
	res.forEach((item) => arr.push(...JSON.parse(item.content)))
	return arr
}

const getNewChars = (arrInDb, arrNew) => {
	let charsInDb = arrInDb.map((character) => character.name)
	let charsNew = arrNew.map((character) => character.name)
	return charsNew.filter((item) => charsInDb.indexOf(item) === -1)
}

const getExistingChars = (arrInDb, arrNew) => {
	let charsInDb = arrInDb.map((character) => character.name)
	let charsNew = arrNew.map((character) => character.name)
	return charsNew.filter((character) => charsInDb.includes(character))
}

const ifExistInList = (list, name) => {
	return list.map((character) => character.name).some((char1) => char1.includes(name))
}

const hasDupes = (userChars, listChars) => {
	let res = false
	let arr1 = userChars.map((character) => character.name)
	let arr2 = listChars.map((character) => character.name)
	arr1.forEach((name) => {
		if (arr2.some((char) => char.includes(name))) res = true
		return
	})
	return res
}

const testFc = () => {
	console.log('====================================')
	console.log()
	console.log('====================================')
}

module.exports = {
	checkPartner,
	gachaGame,
	getListCharacters,
	getNewChars,
	getExistingChars,
	ifExistInList,
	hasDupes,
	testFc,
}
