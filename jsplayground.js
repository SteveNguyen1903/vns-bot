var fs = require('fs')
const path = require('path')
const partnerSchema = require('@schema/partner-schema')

const arr1 = [
	{ name: 'des1', type: 'test1' },
	{ name: 'des2', type: 'test1' },
	{ name: 'des3', type: 'test1' },
	{ name: 'des4', type: 'test1' },
	{ name: 'des5', type: 'test1' },
]

const arr2 = [{ name: 'des1' }, { name: 'des2' }]

const test = arr2.map((character) => {
	const testres = arr1.filter((item) => item.name === character.name)
	return testres
})

console.log(test)
