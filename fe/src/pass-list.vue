<template>
    <div class="pass-list panel panel-primary"
         :id="`pass-list-${_uid}`">
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
                            <button v-if="can_remove(item)"
                                    class="btn btn-danger btn-pass-remove"
                                    @click="remove(index)"><span class="fa fa-remove"></span></button>
                            <button v-if="item.stored === 'removing'"
                                    class="btn btn-danger btn-pass-remove"
                                    disabled><span class="fa fa-remove fa-spin"></span></button>
                            <button v-if="can_save(item)"
                                    class="btn btn-primary"
                                    @click="save(item)"><span class="fa fa-refresh"></span></button>
                            <button v-if="item.stored === 'storing'"
                                    class="btn btn-primary"
                                    disabled><span class="fa fa-refresh fa-spin"></span></button>
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
import * as utls from './utility.js';

export default {
    components: { PassAdder },
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
                    status: undefined
                },
                editing: false
            };
        }, this);
        return {
            items: items
        };
    },
    computed: {
        state_entries() {
            return this.$store.state.entries;
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
                        status: undefined
                    },
                    editing: false
                };
            });
        }
    },
    methods: {
        requires_attention: function (item) {
            return item.stored === 'notstored' || item.last_op.status === 'failure';
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
            this.items.push(item);

            this.save(item);
        },
        save: function (item) {
            item.stored = "storing";
            item.last_op = {
                id: utls.generateUniqueId(),
                status: 'inprogress'
            };
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
            item.last_op = {
                id: utls.generateUniqueId(),
                status: 'inprogress'
            };
            const this_op_id = item.last_op.id;

            this.$store.dispatch('remove_entry_by_id', item.id)
                .then(() => {
                    item.stored = "notstored";
                    item.last_op.status = "success";
                }, () => {
                    item.stored = oldstored;
                    item.last_op.status = "failure";
                    setTimeout(() => {
                        if (item.last_op.id === this_op_id) {
                            // means no other operation was performed since we tried
                            item.last_op = oldlastop;
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
    width: 100px;
}
</style>