<template>
    <div class="pk-pass-editor"
        :id="`pk-pass-editor-${_uid}`">
        <modal :show="true"
              @ok="ok"
              @cancel="cancel">
            <span slot="title">{{ $t('editor_title') }}</span>
            <span slot="button_ok">{{ $t('button_ok') }}</span>
            <span slot="button_cancel">{{ $t('button_cancel') }}</span>

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
                <label :for="`pk-pass-input-${_uid}`">{{ $t('label_password') }}</label>
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
        </modal>
    </div>
</template>

<script src="./pk-pass-editor.js"></script>
