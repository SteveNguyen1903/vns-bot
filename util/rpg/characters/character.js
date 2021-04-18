class Character {
	constructor(name, xp, affectionLvl, copies, ascension, anime, stars, description, img) {
		this.name = name
		this.xp = xp
		this.affectionLvl = affectionLvl
		this.copies = copies
		this.ascension = ascension
		this.anime = anime
		this.stars = stars
		this.description = description
		this.img = img
	}

	get bonusChance() {
		return this.stars * 0.015 + (this.affectionLvl + 1.5 / this.affectionLvl) * 0.01
	}

	get neededXp() {
		return this.affectionLvl * this.affectionLvl * 150
	}

	get showStars() {
		// ☆
		let res = ''
		for (let i = 0; i < this.stars; i++) res += '✭'
		return res
	}

	addXp(number) {
		if (this.affectionLvl < 10) {
			this.xp += number
			if (this.xp >= this.neededXp) {
				this.xp -= this.neededXp
				this.affectionLvl += 1
			}
		}
	}

	upAscension() {
		this.copies--
		this.ascension++
	}

	// speak() {
	//     console.log(`${this.name} said smth`);
	// }
}

class lowRarity extends Character {
	constructor(name, xp, affectionLvl, copies, ascension, anime, stars, description, img) {
		super(name, xp, affectionLvl, copies, ascension, anime, stars, description, img)
	}

	// speak() {
	//     super.speak()
	//     console.log('extra smth')
	// }
}

module.exports = {
	Character,
	lowRarity,
}
