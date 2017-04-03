<template>
    <div class="pk-pass-list panel panel-primary"
         :id="`pk-pass-list-${_uid}`">
        <pk-pass-editor :show="editing_item !== undefined"
                        :item="editing_item"
                        @cancel="cancel_edit"
                        @edit="apply_edit"></pk-pass-editor>
        <div class="panel-heading">
            <h3 class="panel-title">{{ $t('passlist.panel_title') }}</h3>
        </div>
        <div class="panel-body">
            <transition name="fade">
                <div v-if="show_filter">
                    <pk-pass-filter v-model="filter_query"></pk-pass-filter>
                    <transition name="fade"
                                mode="out-in">
                        <table class="table"
                               v-if="show_passlist">
                            <thead>
                                <tr>
                                    <th>{{ $t('label_title') }}</th>
                                    <th>{{ $t('label_user') }}</th>
                                    <th>{{ $t('label_password') }}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <transition-group name="fade"
                                              tag="tbody">
                                <tr v-for="(item, index) in filtered_items"
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
                                        <span :id="`pk-item-password-${index}-${_uid}`"
                                              :class="{'blur': !item.show_password}">{{ item.password }}</span>
                                    </td>
                                    <td>
                                        <button :disabled="!can_edit(item)"
                                                class="btn btn-default pk-btn-pass-edit"
                                                @click="editing_item = item"><span class="fa fa-edit"></span></button>
                                        <button v-if="is_removing(item)"
                                                class="btn btn-danger pk-btn-pass-remove"
                                                disabled><span class="fa fa-remove fa-spin"></span></button>
                                        <button v-else-if="can_remove(item)"
                                                class="btn btn-danger pk-btn-pass-remove"
                                                @click="remove(item)"><span class="fa fa-remove"></span></button>
                                        <button v-if="is_saving(item)"
                                                class="btn btn-primary"
                                                disabled><span class="fa fa-save fa-spin"></span></button>
                                        <button v-else-if="can_save(item)"
                                                class="btn btn-primary"
                                                @click="save(item)"><span class="fa fa-save"></span></button>
                                    </td>
                                </tr>
                            </transition-group>
                        </table>
                        <p v-else>
                            <em>{{$t("no_passwords_found")}}</em>
                        </p>
                    </transition>
                </div>
            </transition>
    
            <pk-pass-adder @added="add"></pk-pass-adder>
        </div>
    </div>
</template>

<script>
import PkPassAdder from './pk-pass-adder.vue';
import PkPassEditor from './pk-pass-editor.vue';
import PkPassFilter from './pk-pass-filter.vue';

import * as dispatcher from 'src/dispatcher.js';
import * as utls from 'src/utility.js';

export default {
    components: {
        PkPassAdder,
        PkPassEditor,
        PkPassFilter
    },
    data: function () {
        const items = this.$store.state.entries.map(function (element) {
            return {
                id: element.id,
                title: element.title,
                user: element.user,
                password: element.password,
                show_password: false,
                stored: "stored",
                dispatcher: new dispatcher.DispatchObj()
            };
        }, this);
        return {
            items: items,
            editing_item: undefined,
            filter_query: ""
        };
    },
    created() {
        if (this.items.length <= 0) {
            this.$store.dispatch('get_entries');
        }

        let that = this;

        this._dispatch_manager = new dispatcher.DispatchManager({
            dummy: {
                action() { return Promise.resolve(); },
                with_delay: false
            },
            add: {
                action(item) {
                    that.items.push(item);
                    // TODO: here store.dispatch assigns id to item on success by itself :(
                    return that.$store.dispatch('add_entry', item).then((id) => {
                        item.stored = "stored";
                        return id;
                    });
                },
                with_delay: true
            },
            save: {
                action(item) {
                    // TODO: here store.dispatch assigns id to item on success by itself :(
                    return that.$store.dispatch('add_entry', item).then((id) => {
                        item.stored = "stored";
                        return id;
                    });
                },
                with_delay: true
            },
            update: {
                action(item) {
                    return that.$store.dispatch('update_entry', item).then(val => {
                        item.stored = "stored";
                        return val;
                    }, val => {
                        item.stored = "notstored";
                        throw val;
                    });
                },
                with_delay: true
            },
            remove: {
                action(item) {
                    if (item.id === undefined) {
                        let index = that.items.indexOf(item);
                        that.items.splice(index, 1);
                        return Promise.resolve();
                    }

                    let promise = that.$store.dispatch('remove_entry_by_id', item.id);
                    let op_id = that.get_last_op(item).id;

                    return promise
                        .then(val => {
                            item.stored = "notstored";
                            return val;
                        }, val => {
                            _.delay(() => {
                                let last_op_id = that.get_last_op(item).id;
                                if (op_id === last_op_id) {
                                    // means no other operation was performed since we tried
                                    that._dispatch_manager.enqueue(item.dispatcher, 'dummy');
                                    // adding dummy operation to shut up `requires_attention`
                                }
                            }, 5000);
                            throw val;
                        });
                },
                with_delay: true
            }
        });
    },
    computed: {
        state_entries() {
            return this.$store.state.entries;
        },
        show_filter() {
            return this.items.length > 0;
        },
        show_passlist() {
            return this.filtered_items.length > 0;
        },
        filtered_items() {
            return this.items.filter((item) => item.title.toLowerCase().indexOf(this.filter_query.toLowerCase()) >= 0);
        }
    },
    watch: {
        state_entries(new_entries) {
            utls.merge_arrays_of_objects(this.items, new_entries, "id", () => {
                return {
                    show_password: false,
                    stored: "stored",
                    dispatcher: new dispatcher.DispatchObj()
                };
            });
        }
    },
    methods: {
        get_last_op(item) {
            return dispatcher.get_last_op(item.dispatcher);
        },
        get_last_last_op(item) {
            return dispatcher.get_last_last_op(item.dispatcher);
        },
        requires_attention(item) {
            let last_op = this.get_last_op(item);
            return (item.stored === 'notstored' && !this.is_saving(item)) || last_op.status === 'failure' || (last_op.status === 'inprogress' && this.get_last_last_op(item).status === 'failure');
        },
        cancel_edit() {
            this.editing_item = undefined;
        },
        can_edit(item) {
            return this.editing_item === undefined && this._dispatch_manager.can_dispatch(item.dispatcher);
        },
        can_remove(item) {
            return this._dispatch_manager.can_dispatch(item.dispatcher);
        },
        is_removing(item) {
            let last_op = this.get_last_op(item);
            return last_op.name === 'remove' && last_op.status === 'inprogress';
        },
        can_save(item) {
            return item.stored === 'notstored' && this._dispatch_manager.can_dispatch(item.dispatcher);
        },
        is_saving(item) {
            let last_op = this.get_last_op(item);
            return (last_op.name === 'save' || last_op.name === 'add' || last_op.name === 'update') && last_op.status === 'inprogress';
        },
        add(item) {
            item.show_password = false;
            item.stored = "notstored";
            item.dispatcher = new dispatcher.DispatchObj();
            this._dispatch_manager.dispatch(item.dispatcher, 'add', item);
        },
        apply_edit(item) {
            this.editing_item.title = item.title;
            this.editing_item.user = item.user;
            this.editing_item.password = item.password;

            item = this.editing_item;
            this.editing_item = undefined;

            this._dispatch_manager.dispatch(item.dispatcher, 'update', item);
        },
        save(item) {
            this._dispatch_manager.dispatch(item.dispatcher, 'save', item);
        },
        remove(item) {
            this._dispatch_manager.dispatch(item.dispatcher, 'remove', item);
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