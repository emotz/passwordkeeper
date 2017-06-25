export default function(el, binding) {
    // example usage: hello<span v-pk-visible="false === true">not visible</span>world
    el.style.visibility = binding.value ? 'visible' : 'hidden';
}
