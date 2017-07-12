<template>
    <div class="pk-pass-list panel panel-primary"
         :id="`pk-pass-list-${_uid}`">
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
                                                @click="edit(item)"><span class="fa fa-edit"></span></button>
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

<script src="./pk-pass-list.js"></script>

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
