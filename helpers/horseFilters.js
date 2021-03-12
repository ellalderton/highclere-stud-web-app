import { isNull as _isNull, filter as _filter, sortBy as _sortBy, find as _find, contains as _contains } from 'underscore';

import moment from 'moment';

class horseFilters {

	constructor(horses, filters, usersHorses) {
		this.horses = horses;
		this.filters = filters;
		this.usersHorses = usersHorses;
	}

	filterHorses() {
		let filteredHorses = this.horses;

		filteredHorses = this.filterByType(filteredHorses);
		filteredHorses = this.filterByKey(filteredHorses, 'age');
		filteredHorses = this.filterByKey(filteredHorses, 'current_location');
		filteredHorses = this.filterByColour(filteredHorses);
		filteredHorses = this.filterByGender(filteredHorses);
		filteredHorses = this.filterByTrainer(filteredHorses);
		filteredHorses = this.filterByOwner(filteredHorses);
		filteredHorses = this.filterByPregnancy(filteredHorses);
		filteredHorses = this.filterByKey(filteredHorses, 'group');
		filteredHorses = this.filterByUsersHorses(filteredHorses);

		if(this.filters.sort === 'note-date') {
			filteredHorses = this.sortByLastNoteDate(filteredHorses);
		} else {
			filteredHorses = this.sortByName(filteredHorses);
		}
		

		return filteredHorses;
	}

	// sortHorses(filteredHorses) {
	// 	if(this.order === 'asc') {
	// 		return _.sortBy(filteredHorses, horse => {
	// 			return horse.name;
	// 		}).reverse();
	// 	} else {
	// 		return _.sortBy(filteredHorses, horse => {
	// 			return horse.name;
	// 		});
	// 	}
	// }
	
	sortByName(filteredHorses) {
		return _sortBy(filteredHorses, horse => {
			let name = horse.name;
			if(!isNaN(horse.name.charAt(0))) {
				name = `xxx${horse.name}`;
			}

			return name;
		});
	}

	sortByLastNoteDate(filteredHorses) {
		return _sortBy(filteredHorses, horse => {
			let date = horse.latest_note_date ? moment(new Date(horse.latest_note_date.split('/').reverse().join('/'))) : moment().subtract(10, 'years');

			return date.format('X');
		})
	}

	filterByKey(horses, key) {

		if(!_isNull(this.filters[key]) && this.filters[key] !== '') {
			horses = _filter(horses, (horse) => {
				// if key contains a plus then do a >= instead of ===
				if(typeof this.filters[key] === 'string' && this.filters[key].charAt(0) === '+') {
					return horse[key] >= parseInt(this.filters[key].substr(1));
				}

				return horse[key] === this.filters[key];
			});
		}
		
		return horses;
	}

	filterByColour(horses) {
		if(!_isNull(this.filters.primary_color) && this.filters.primary_color.toLowerCase() !== '') {
			horses = _filter(horses, (horse) => {
				return horse.colour.toLowerCase() === this.filters.primary_color.toLowerCase();
			});
		}
		
		return horses;
	}

	filterByGender(horses) {
		if(!_isNull(this.filters.sex) && this.filters.sex.toLowerCase() !== '') {
			horses = _filter(horses, (horse) => {
				return horse.sex.toLowerCase() === this.filters.sex.toLowerCase();
			});
		}
		
		return horses;
	}

	filterByType(horses) {
		if(this.filters.type === 'training') {
			horses = _filter(horses, (horse) => {
				return horse.horse_type_id === 3;
			});
		} else {
			horses = _filter(horses, (horse) => {
				return horse.horse_type_id !== 3;
			});
		}
		
		return horses;
	}

	filterByTrainer(horses) {
		if(!_isNull(this.filters.trainer)) {
			horses = _filter(horses, (horse) => {
				let hasTrainer = false;

				horse.trainers.forEach(trainer => {
					if(trainer.id === this.filters.trainer) {
						hasTrainer = true
					}
				});

				return hasTrainer;
			});
		}
		
		return horses;
	}

	filterByOwner(horses) {
		if(!_isNull(this.filters.owners)) {
			horses = _filter(horses, (horse) => {
				return horse.ownership &&
				horse.ownership.id === this.filters.owners;
			});
		}

		return horses;			
	}

	filterByPregnancy(horses) {
		if(!_isNull(this.filters.pregnancy_status)) {
			horses = _filter(horses, horse => {
				return horse.pregnancy_status &&
					horse.pregnancy_status.id === this.filters.pregnancy_status;
			});
		}

		return horses;
	}

	filterByUsersHorses(horses) {
		if(!_isNull(this.filters.usersHorses) && !_isNull(this.usersHorses)) {
			let user = _find(this.usersHorses, user => {
				
				return user.id === this.filters.usersHorses;
			})

			if(user) {
				horses = _filter(horses, horse => {
					return _contains(user.horses, horse.id);
				});
			}		
		}

		return horses;
	}
}

export default horseFilters;