import * as i18n from 'src/plugins/i18n.js';
import { http } from 'src/plugins/http.js';

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
        exportToCSV() {
            //try {
                let response = http.get('api/export',
                    {},
                    //{responseType: 'arraybuffer'}
                ).then(function (response) {
                    var headers = response.headers;
                    var blob = new Blob([response.data],{type:response.headers.get('content-type')});
                    var link = document.createElement('a');
                    var filename = response.headers.get('content-disposition').split('filename=')[1].replace('-', '');
                    console.log(filename);
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;
                    return link.click();
                });
                //var contentDisposition = response.headers.get('Content-Disposition') || '';
                //var filename = contentDisposition.split('filename=')[1];
                //console.log(response.headers.get('content-disposition').split('filename=')[1]);
                /*let blob = new Blob([response.blob()], {type: response.headers.get('content-type')}),
                    filename = (response.headers.get('content-disposition') || '').split('filename=')[1];*/
                /*filename = (response.headers.get('content-disposition') || '').split('filename=')[1];
                let result = document.createElement('a');
                result.href = window.URL.createObjectURL(blob);
                result.download = filename;
                return result;*/
            /*}
            catch (err) {
                console.log(err);
                return;
            }*/
        }
    },
};
