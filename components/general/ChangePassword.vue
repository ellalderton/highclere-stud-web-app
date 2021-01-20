<template>
    <form class="form-group mb-3" @submit.prevent="submit">
        <div class="form-group">
            <label class="form-label" for="oldPassword">Old Password</label>
            <input
                class="form-control"
                type="password"
                name="oldPassword"
                placeholder="Type here..."
                v-model.trim="$v.form.old_password.$model"
                :state="!$v.form.old_password.$error && null"
            >
            <div class="invalid-feedback" v-if="$v.form.old_password.$error">
                Please enter your current password.
            </div>
        </div>

        <div class="form-group">
            <label class="form-label" for="newPassword">New Password</label>
            <input
                class="form-control"
                type="password"
                name="newPassword"
                placeholder="Type here..."
                v-model.trim="form.new_password"
                @change="$v.form.new_password.$touch()"
                :state="!$v.form.new_password.$error && null"
            >
            <div class="invalid-feedback" v-if="$v.form.new_password.$error">
                Please enter your new password with at least 6 characters.
            </div>
        </div>

        <div class="form-group">
            <label class="form-label" for="confirmNewPassword">Confirm New Password</label>
            <input
                class="form-control"
                type="password"
                name="confirmNewPassword"
                placeholder="Type here..."
                v-model.trim="form.new_password_confirmation"
                @change="$v.form.new_password_confirmation.$touch()"
                :state="!$v.form.new_password_confirmation.$error && null"
            >
            <div class="invalid-feedback" v-if="$v.form.new_password_confirmation.$error">
                Does not match your new password.
            </div>
        </div>

        <div class="block-btn-group pt-2">
            <app-button v-on:btn-click="submit" :disabled="$v.form.$invalid" black block>Update</app-button>
        </div>
    </form>
</template>

<script>
import { required, minLength, sameAs } from 'vuelidate/lib/validators';

    export default {
        data() {
            return {
                form: {
                    old_password: '',
                    new_password: '',
                    new_password_confirmation: ''
                }
            }
        },
        validations: {
            form: {
                old_password: {
                    required,
                },
                new_password: {
                    required,
                    minLength: minLength(6)
                },
                new_password_confirmation: {
                    required,
                    sameAsPassword: sameAs('new_password')
                }
            }
        },
        methods: {
            submit() {
                this.$axios.$patch(`${process.client ? window.location.origin : ''}/w-api/api/me/change-password`, this.form)
                    .then((res) => {
                        this.$swal({
                            type: 'success',
                            text: 'Your password has been updated',
                            backdrop: `
                            rgba(12, 12, 12, 0.68);
                        `
                        });
                       this.clearForm();
                    }, (err) => {
                           this.$swal({
                               type: 'error',
                               text: err.response.data.message,
                               backdrop: `
                                rgba(12, 12, 12, 0.68);
                            `
                       });
                    });
            },
            clearForm() {
                this.form.old_password = '';
                this.form.new_password = '';
                this.form.new_password_confirmation = '';
                this.$nextTick(() => { this.$v.$reset() })
            }
        }
    }
</script>

<style>
    .invalid-feedback {
           display: block;
        width: 100%;
        margin-bottom: 18px;
        font-size: 80%;
        color: #dc3545;
    }
</style>