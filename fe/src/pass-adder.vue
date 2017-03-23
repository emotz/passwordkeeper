<template>
    <div class="pass-adder form-inline"
         :id="`pass-adder-${_uid}`">
        <div class="form-group"
             :class="{'has-error': title_error}">
            <label class="control-label"
                   :for="`title-input-${_uid}`">Title</label>
            <input type="text"
                   class="title-input form-control"
                   :id="`title-input-${_uid}`"
                   placeholder="mysite.com"
                   v-model="title">
        </div>
        <div class="form-group"
             :class="{'has-error': user_error}">
            <label class="control-label"
                   :for="`user-input-${_uid}`">User</label>
            <input type="text"
                   class="user-input form-control"
                   :id="`user-input-${_uid}`"
                   placeholder="jane.doe@example.com"
                   v-model="user">
        </div>
        <div class="form-group">
            <!--TODO get rid of hardcoded ids ? wouldnt be able to reuse component-->
            <label :for="`pass-input-${_uid}`">Password</label>
            <div class="input-group">
                <input v-if="show_password"
                       type="text"
                       class="pass-input form-control"
                       :id="`pass-input-${_uid}`"
                       placeholder="Password123"
                       v-model="password">
                <input v-else
                       type="password"
                       class="pass-input form-control"
                       :id="`pass-input-${_uid}`"
                       placeholder="Password123"
                       v-model="password">
                <div class="btn btn-default input-group-addon"
                     @click="show_password = !show_password"
                     :class="{'active': show_password}"
                     :aria-pressed="show_password"><span class="fa fa-eye"></span></div>
            </div>
        </div>
        <button class="btn btn-default btn-pass-add"
                :id="`pass-add-${_uid}`"
                @click="add"><span class="fa fa-plus force-parent-lh"></span></button>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            title: "",
            title_error: false,
            user: "",
            user_error: false,
            password: "",
            show_password: false
        };
    },
    methods: {
        add: function () {
            if (this.title.length <= 0) this.title_error = true;
            if (this.user.length <= 0) this.user_error = true;
            if (this.title.length > 0 && this.user.length > 0) {
                this.$emit('added', {
                    title: this.title,
                    user: this.user,
                    password: this.password
                });
            }
        }
    },
    watch: {
        title: function (val) {
            this.title_error = false;
        },
        user: function (val) {
            this.user_error = false;
        }
    }
}
</script>