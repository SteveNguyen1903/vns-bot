var fs = require('fs')
const path = require('path')
/**
 * Promise all
 */
function promiseAllP(items, block) {
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
} //promiseAll

/**
 * read files
 * @param dirname string
 * @return Promise
 */
function readFiles(dirname) {
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

const res = await readFiles('./json/partner')

let arr = []
res.forEach((item) => arr.push(...JSON.parse(item.content)))

// console.log(arr)

const number1 = 'av'

const result = (args) => {
	if (!Number.isInteger(number1)) return true
}

console.log(result(number1))

let dupp = {
	Saber: 2,
	'Marine Houshou': 2,
	'Pekora Usada': 1,
	'Miko Sakura': 1,
	'Sayu Ogiwara': 1,
	'Ayame Nakiri': 1,
	'Kanade Tachibana': 1,
	'Asuka Langley Souryuu': 1,
}

const entries = Object.entries(dupp).map((item) => {
	return { name: item[0], copies: item[1] }
})
//   console.log(entries)

const pn = require('@util/partner/partner-features')
const listCharacters = await pn.getListCharacters()

userCharsDb = {
	partners: [
		{ name: 'Ayame Nakiri', copies: 10 },
		{ name: 'Pico', copies: 9 },
		{ name: 'Rushia Uruha', copies: 8 },
		{ name: 'Miko Sakura', copies: 12 },
		{ name: 'Pekora Usada', copies: 8 },
		{ name: 'Fubuki Shirakami', copies: 13 },
		{ name: 'Violet Evergarden', copies: 3 },
		{ name: 'Ai Hayasaka', copies: 2 },
		{ name: 'Marine Houshou', copies: 11 },
		{ name: 'Asuka Langley Souryuu', copies: 5 },
		{ name: 'Korone Inugami', copies: 11 },
		{ name: 'Sayu Ogiwara', copies: 14 },
		{ name: 'Okayu Nekomata', copies: 8 },
		{ name: 'Kokoa Hoto', copies: 2 },
		{ name: 'Phosphophyllite', copies: 2 },
		{ name: 'Zero Two', copies: 1 },
		{ name: 'Chika Fujiwara', copies: 1 },
		{ name: 'Rei Ayanami', copies: 3 },
		{ name: 'Kaguya Shinomiya', copies: 1 },
		{ name: 'Chino Kafuu', copies: 2 },
		{ name: 'Ichigo', copies: 2 },
		{ name: 'Kanade Tachibana', copies: 2 },
		{ name: 'Rin Toosaka', copies: 2 },
	],
}

// console.log(listCharacters)

// const testRes = (list, name) => {
// 	return list.map((character) => character.name).some((char1) => char1.includes(name))
// }
const testRes = (list, name) => {
	return list.filter((character) => character.name.includes(name))
}

const getDupes = (userChars, listChars) => {
	let res = false
	// let arr1 = userCharsDb.partners.map((character) => character.name)
	// let arr2 = listCharacters.map((character) => character.name)
	let arr1 = userChars.map((character) => character.name)
	let arr2 = listChars.map((character) => character.name)
	arr1.forEach((name) => {
		if (arr2.some((char) => char.includes(name))) res = true
	})
	return res
}

console.log(testRes(listCharacters, '02'))
// console.log(testRes(userCharsDb.partners, '02'))
