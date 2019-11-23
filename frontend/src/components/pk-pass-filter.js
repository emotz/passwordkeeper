
import _ from 'lodash';

export default {
  props: ['value'],
  methods: {
    updateValue: _.debounce(function(new_value) {
      this.$emit("input", new_value);
    }, 300)
  }
};
