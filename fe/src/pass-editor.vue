<template>
    <div class="pass-editor"
         :id="`pass-editor-${_uid}`">
        <!--text content-->
        <modal title="Modal Title"
               :show="show_modal()"
               @ok="ok"
               @cancel="cancel">
            Modal Text
        </modal>
    
        <!--<modal title="Edit password entry"
                                                   :show.sync="show"
                                                   @ok="ok"
                                                   @cancel="cancel">
                                                Modal Text
                                            </modal>-->
    </div>
</template>

<script>

import Modal from 'vue-bootstrap-modal';

export default {
    components: { Modal },
    props: ['title', 'user', 'password', 'show'],
    data: function () {
        return {

        };
    },
    // computed: {
    //     show_modal() { return this.show; }
    // },
    methods: {
        show_modal: function () {
            return this.show;
        },
        ok: function () {
            this.$emit('edit', {
                title: this.title,
                user: this.user,
                password: this.password
            });
        },
        cancel: function () {
            console.log("cancelled edit");
            this.$emit("cancel");
        }
    }
}
</script>