<template>
    <form class="pk-pass-adder form-inline"
          :id="`pk-pass-adder-${_uid}`">
        <div class="form-group"
             :class="{'has-error': title_error}">
            <label class="control-label"
                   :for="`pk-title-input-${_uid}`">{{ $t('label_title') }}</label>
            <input type="text"
                   class="pk-title-input form-control"
                   :id="`pk-title-input-${_uid}`"
                   placeholder="mysite.com"
                   v-model="title">
        </div>
        <div class="form-group"
             :class="{'has-error': user_error}">
            <label class="control-label"
                   :for="`pk-user-input-${_uid}`">{{ $t('label_user') }}</label>
            <input type="text"
                   class="pk-user-input form-control"
                   :id="`pk-user-input-${_uid}`"
                   placeholder="jane.doe@example.com"
                   v-model="user">
        </div>
        <div class="form-group">
            <label :for="`pass-input-${_uid}`">{{ $t('label_password') }}</label>
            <div class="input-group">
                <input v-if="show_password"
                       type="text"
                       class="pk-pass-input form-control"
                       :id="`pk-pass-input-${_uid}`"
                       placeholder="Password123"
                       v-model="password">
                <input v-else
                       type="password"
                       class="pk-pass-input form-control"
                       :id="`pk-pass-input-${_uid}`"
                       placeholder="Password123"
                       v-model="password">
                <div class="btn btn-default input-group-addon"
                     @click="show_password = !show_password"
                     :class="{'active': show_password}"
                     :aria-pressed="show_password"><span class="fa fa-eye"></span></div>
            </div>
        </div>
        <button class="btn btn-default pk-btn-pass-add"
                :id="`pk-pass-add-${_uid}`"
                type="submit"
                @click.prevent="add"><span class="fa fa-plus force-parent-lh"></span></button>
    </form>
</template>

<script src="./pk-pass-adder.js"></script>