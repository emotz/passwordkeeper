import * as i18n from 'src/plugins/i18n.js';
import { http } from 'src/plugins/http.js';
import * as auth from 'src/services/auth.js';

export default {
  data() {
    return {
      locales: i18n.get_locales()
    };
  },
  computed: {
    locale: {
      get() {
        return i18n.get_locale();
      },
      set(new_locale) {
        i18n.set_locale(new_locale);
      }
    }
  },
  methods: {
    async exportToCSV() {
      const response = await http.get('api/export/csv',
                {},
                { responseType: 'arraybuffer' });
      const blob = new Blob([response.data], { type: response.headers.get('content-type') });
      const link = document.createElement('a');
      const filename = response.headers.get('content-disposition').split('filename=')[1].replace('-', '');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      return link.click();
    },
    async exportToXML() {
      const response = await http.get('api/export/xml',
                {},
                { responseType: 'arraybuffer' });
      const blob = new Blob([response.data], { type: response.headers.get('content-type') });
      const link = document.createElement('a');
      const filename = response.headers.get('content-disposition').split('filename=')[1].replace('-', '');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      return link.click();
    },
    can_export() {
      return auth.is_authenticated();
    }
  }
};
