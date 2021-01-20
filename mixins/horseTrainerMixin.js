const horseTrainerMixin = {
	computed: {
		horseTrainer() {
			if(!this.horse.trainers.length) return 'Unallocated';

			return this.horse.trainers[0].name;
		},
		horseTrainerId() {
			if(!this.horse.trainers.length) return null;
			return this.horse.trainers[0].id;
		}
	},
	methods: {
		viewFilterByTrainer() {
			if(this.horseTrainerId !== null) {
				this.$store.commit('horses/filterByTrainer', this.horseTrainerId);

				if($nuxt.$route.name === 'horses') {
					this.$nuxt.$emit('filterByTrainer', this.horseTrainerId);
				} else {
					this.$router.push('/horses');
				}
			}
		}
	}
}

export default horseTrainerMixin;