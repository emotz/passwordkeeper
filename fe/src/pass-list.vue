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
                        :class="{danger: item.stored==='notstored' || item.op_failed}">
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
                            <button v-if="item.stored !== 'removing'"
                                    :disabled="item.stored === 'storing'"
                                    class="btn btn-danger btn-pass-remove"
                                    @click="remove(index)"><span class="fa fa-remove"></span></button>
                            <button v-if="item.stored === 'removing'"
                                    class="btn btn-danger btn-pass-remove"
                                    disabled><span class="fa fa-remove fa-spin"></span></button>
                            <button v-if="item.stored === 'notstored'"
                                    class="btn btn-primary"
                                    @click="retry_add(item)"><span class="fa fa-refresh"></span></button>
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
                op_failed: false
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
            utls.merge_arrays_of_objects(this.items, new_entries, "id", () => { return { show_password: false, stored: "stored", op_failed: false }; });
        }
    },
    methods: {
        add: function (item) {
            item.show_password = false;
            item.stored = "notstored";
            this.items.push(item);

            item.stored = "storing";
            this.$store.dispatch('add_entry', item).then((id) => {
                item.stored = "stored";
                item.op_failed = false;
            }, () => {
                item.stored = "notstored";
                item.op_failed = true;
            });
        },
        retry_add: function (item) {
            item.stored = "storing";
            this.$store.dispatch('add_entry', item).then((id) => {
                item.stored = "stored";
                item.op_failed = false;
            }, () => {
                item.stored = "notstored";
                item.op_failed = true;
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
            this.$store.dispatch('remove_entry_by_id', item.id)
                .then(() => { }, () => { item.stored = oldstored; });
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