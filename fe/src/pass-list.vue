<template>
    <div class="pass-list panel panel-primary"
         :id="`pass-list-${_uid}`">
        <pass-editor :show="show_edit"
                     :title="editing_title"
                     :user="editing_user"
                     :password="editing_password"
                     @cancel="cancel_edit"
                     @edit="edit"></pass-editor>
        <div class="panel-heading">
            <h3 class="panel-title">Stored passwords</h3>
        </div>
        <div class="panel-body">
            <table class="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>User</th>
                        <th>Password</th>
                        <th></th>
                    </tr>
                </thead>
                <transition-group name="only-fadein"
                                  tag="tbody">
                    <tr v-for="(item, index) in items"
                        :key="item"
                        :class="{danger: requires_attention(item)}">
                        <td>{{ item.title }}</td>
                        <td>{{ item.user }}</td>
                        <td>
                            <button type="button"
                                    class="btn btn-default pull-right"
                                    :class="{'active': item.show_password}"
                                    :aria-pressed="item.show_password"
                                    @click="item.show_password = !item.show_password"
                                    v-if="item.password !== ''">
                                <span class="fa fa-eye"></span>
                            </button>
                            <span :id="`item-password-${index}-${_uid}`"
                                  :class="{'blur': !item.show_password}">{{ item.password }}</span>
                        </td>
                        <td>
                            <button :disabled="!can_edit(item)"
                                    class="btn btn-default btn-pass-edit"
                                    @click="editing_item = item"><span class="fa fa-edit"></span></button>
                            <button v-if="can_remove(item)"
                                    class="btn btn-danger btn-pass-remove"
                                    @click="remove(index)"><span class="fa fa-remove"></span></button>
                            <button v-if="item.stored === 'removing'"
                                    class="btn btn-danger btn-pass-remove"
                                    disabled><span class="fa fa-remove fa-spin"></span></button>
                            <button v-if="can_save(item)"
                                    class="btn btn-primary"
                                    @click="save(item)"><span class="fa fa-save"></span></button>
                            <button v-if="item.stored === 'storing'"
                                    class="btn btn-primary"
                                    disabled><span class="fa fa-save fa-spin"></span></button>
                        </td>
                    </tr>
                </transition-group>
            </table>
    
            <pass-adder v-on:added="add"></pass-adder>
        </div>
    </div>
</template>

<script>
import PassAdder from './pass-adder.vue';
import PassEditor from './pass-editor.vue';
import visible from './directives/visible.js';

import * as utls from './utility.js';

export default {
    directives: { visible },
    components: { PassAdder, PassEditor },
    data: function () {
        const items = this.$store.state.entries.map(function (element) {
            return {
                id: element.id,
                title: element.title,
                user: element.user,
                password: element.password,
                show_password: false,
                stored: "stored",
                last_op: {
                    id: undefined,
                    status: undefined,
                    prev_op_status: undefined
                }
            };
        }, this);
        return {
            items: items,
            editing_item: undefined
        };
    },
    computed: {
        state_entries() {
            return this.$store.state.entries;
        },
        show_edit() {
            return this.editing_item !== undefined;
        },
        editing_title() {
            return (this.editing_item || {}).title;
        },
        editing_user() {
            return (this.editing_item || {}).user;
        },
        editing_password() {
            return (this.editing_item || {}).password;
        }
    },
    watch: {
        state_entries: function (new_entries) {
            utls.merge_arrays_of_objects(this.items, new_entries, "id", () => {
                return {
                    show_password: false,
                    stored: "stored",
                    last_op: {
                        id: undefined,
                        status: undefined,
                        prev_op_status: undefined
                    }
                };
            });
        }
    },
    methods: {
        requires_attention: function (item) {
            return item.stored === 'notstored' || item.last_op.status === 'failure' || (item.last_op.status === 'inprogress' && item.last_op.prev_op_status === 'failure');
        },
        can_edit: function (item) {
            return this.editing_item === undefined && item.last_op.status !== 'inprogress';
        },
        can_remove: function (item) {
            return item.stored !== 'removing';
        },
        can_save: function (item) {
            return item.stored === 'notstored';
        },
        add: function (item) {
            item.show_password = false;
            item.stored = "notstored";
            item.last_op = {
                id: undefined,
                status: undefined,
                prev_op_status: undefined
            };
            this.items.push(item);

            this.save(item);
        },
        edit: function (item) {
            this.editing_item.title = item.title;
            this.editing_item.user = item.user;
            this.editing_item.password = item.password;
            this.editing_item.stored = "notstored";

            let updating_item = this.editing_item;
            this.editing_item = undefined;

            updating_item.stored = "storing";
            // TODO: there is a possibility (theoretical) that last_op will be rewritten by another operation before this one finishes
            this.$set(updating_item, 'last_op', {
                id: utls.generateUniqueId(),
                status: 'inprogress',
                prev_op_status: updating_item.last_op.status
            });
            this.$store.dispatch('update_entry', updating_item).then(() => {
                updating_item.stored = "stored";
                updating_item.last_op.status = "success";
            }, () => {
                updating_item.stored = "notstored";
                updating_item.last_op.status = "failure";
            });
        },
        cancel_edit: function () {
            this.editing_item = undefined;
        },
        save: function (item) {
            item.stored = "storing";
            this.$set(item, 'last_op', {
                id: utls.generateUniqueId(),
                status: 'inprogress',
                prev_op_status: item.last_op.status
            });
            this.$store.dispatch('add_entry', item).then((id) => {
                item.stored = "stored";
                item.last_op.status = "success";
            }, () => {
                item.stored = "notstored";
                item.last_op.status = "failure";
            });

        },
        remove: function (index) {
            const item = this.items[index];
            if (item.id === undefined) {
                this.items.splice(index, 1);
                return;
            }
            const oldstored = item.stored;
            item.stored = "removing";
            const oldlastop = item.last_op;
            this.$set(item, 'last_op', {
                id: utls.generateUniqueId(),
                status: 'inprogress',
                prev_op_status: item.last_op.status
            });

            const this_op_id = item.last_op.id;

            this.$store.dispatch('remove_entry_by_id', item.id)
                .then(() => {
                    item.stored = "notstored";
                    item.last_op.status = "success";
                }, () => {
                    item.stored = oldstored;
                    item.last_op.status = "failure";
                    _.delay(() => {
                        if (item.last_op.id === this_op_id) {
                            // means no other operation was performed since we tried
                            this.$set(item, 'last_op', oldlastop);
                            // making impression like we never tried
                        }
                    }, 5000);
                });
        }
    }
}
</script>

<style scoped>
.only-fadein-enter-active {
    transition: opacity .5s
}

.only-fadein-enter,
.only-fadein-leave-to {
    opacity: 0
}

.table {
    word-wrap: break-word;
    table-layout: fixed;
}

th:last-child {
    width: 140px;
}
</style>