<template>
    <div class="pk-pass-filter"
         :id="`pk-pass-filter-${_uid}`">
        <div class="form-group">
            <div class="input-group">
                <div class="input-group-addon"><span class="fa fa-search"></span></div>
                <input type="text"
                       class="form-control pk-pass-filter-input"
                       :bind="value"
                       @input="updateValue($event.target.value)"
                       :placeholder="$t('search_placeholder')">
            </div>
        </div>
    </div>
</template>

<script src="./pk-pass-filter.js"></script>