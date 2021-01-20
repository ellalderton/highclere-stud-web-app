<template>
	<div class="form-group form-group--datepicker">
		<datepicker
		ref="datepicker"
		:name="name" 
		:placeholder="placeholder"
		:format="format"
		:value="date"
		:input-class="inputClasses"
		readonly="true"
		:highlighted="highlighted"
		v-on:input="dateChange"
		:disabled-dates="disabledDates"
		>
		</datepicker>
	</div>
	
</template>

<script>
	import moment from 'moment';

	export default {
		data() {
			return {
				date: null,
				highlighted: {
					dates: [
						new Date()
					]
				}
			}
		},
		props: {
			name: {
				required: true,
				type: String
			},
			placeholder: {
				default: 'Select Date',
				type: String
			},
			old: {
				required: false
			},
			format: {
				required: false,
				default: 'dd/MM/yyyy'
			},
			overwriteClasses: {
				required: false,
				type: String
			},
			invalid: {
				required: false,
				default: false
			},
			disabledDates: {
				required: false,
				type: Object
			}
		},
		mounted() {		
			if(this.old) {
				if(this.format === 'dd-MM-yyyy') {
					this.date = new Date(this.old.split('-').reverse().join('/'));
				} else {
					this.date = new Date(this.old.split('/').reverse().join('/'));
				}
				
			}

			// Stop native keyboard from appearing on mobile.
			document.querySelectorAll(".vdp-datepicker input").forEach(e => (e.readOnly = true));
		},
		watch: {
			old(val) {
				if(val === null) {
					this.date = null;
				}
			}
		},
		computed: {
			inputClasses() {
				if(this.overwriteClasses) return this.overwriteClasses;

				if(this.invalid) {
					return 'form-control form-control--has-icon mt-1 is-invalid';
				}

				return 'form-control form-control--has-icon mt-1';
			}
		},
		methods: {
			openDatePicker() {
				this.$refs.datepicker.$el.getElementsByClassName('form-control')[0].click();
				this.$refs.datepicker.$el.getElementsByClassName('form-control')[0].focus();
			},
			dateChange(date) {
				this.date = date;
				this.$emit('input', moment(date).format('DD/MM/YYYY'));
			}
		}
	}
</script>

<style>
.vdp-datepicker__calendar header {
	color: #00304E;
}
.vdp-datepicker__calendar header .prev:after
{
	border-right: 10px solid #00304E;
}
.vdp-datepicker__calendar header .next:after {
	border-left: 10px solid #00304E;
}
.cell.selected {
	color: white !important;
	background: #191941 !important;
	border-radius: 4px;
}
.cell.day, .cell.month, .cell.year {
	color: #6f6f6f;
}
.cell.day.disabled {
	color: #dadada;
}
@media screen and (max-width: 350px) {
	.vdp-datepicker__calendar {
		width: calc(100% + 40px);
		left: -20px;
	}
	.vdp-datepicker__calendar .cell {
		font-size: 14px;
	}
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
	.filter-bar__filters .vdp-datepicker .form-control {	
		max-width: 250px;
	}
}
.filter-bar-column__filters .form-group--datepicker .form-group__input-icon {
	right: 10px !important;
}
</style>