var ViideaDialog = (function ($) {
    var VD = {
        init: function () {
            VD.typeChange();
            $('table').on('click', '#viideaType', VD.typeChange);
            $('table').on('paste', '#viideaUrl', VD.urlChanged);
            $('table').on('click', '#viideaUrl', VD.selectAll);
            $('table').on('click', 'input[type=checkbox]', VD.preview);
            $('table').on('click', 'label,select', VD.preview);
        },
        urlChanged: function () {
            setTimeout(function () {
                try { var options = VD.getOptions(); VD.showError(); VD.preview(); }
                catch (e) { VD.showError(''+e); }
            }, 0);
        },
        selectAll: function (event) {
            event.currentTarget.select();
        },
        parseHostname: function (hostname) {
            hostname || (hostname = $('#viideaUrl').val());
            var data = {hostname: '', slug: ''};
            if (hostname.substr(0, 7) != 'http://' && hostname.substr(0, 8) != 'https://') {
                hostname = 'http://'+hostname;
            }
            hostname = hostname.split('/');
            data.hostname = hostname.slice(0,3).join('/');
            if (hostname.length > 3) {
                data.slug = hostname[3];
                var i = data.slug.search(/\?/);
                if (i > -1) {
                    data.slug = data.slug.substr(0, i);
                }
            }
            return data;
        },
        getType: function () {
            return $('#viideaType').val();
        },
        typeChange: function () {
            var type = VD.getType();
            if (type == 'iframe') {
                $('.viideaOnly-popup').hide();
                $('.viideaOnly-iframe').show();
            } else if (type == 'popup') {
                $('.viideaOnly-iframe').hide();
                $('.viideaOnly-popup').show();
            }
        },
        showError: function (msg) {
            if (msg) {
                $('.error-msg').show().find('td').text(msg);
            } else {
                $('.error-msg').hide();
            }
        },
        getOptions: function () {
            var type = VD.getType(), options = {type: type};
            if (type != 'popup' && type != 'iframe') throw Error('Type must be set.');
            
            $.extend(options, VD.parseHostname());
            $.extend(options, {
                html5: $('#viideaHtml5').attr('checked') == 'checked' ? true : null
            });
            if (options.hostname == '' || options.hostname == 'http://') throw Error('Hostname missing in URL');
            if (options.slug == '') throw Error('Slug missing in URL');

            if (type == 'popup') {
                $.extend(options, {
                    tabs: $('#viideaTabs').attr('checked') == 'checked' ? true : null
                });
            } else if (type == 'iframe') {
                $.extend(options, {
                    width: parseInt($('#viideaWidth').val(), 10) || '640',
                    height: parseInt($('#viideaHeight').val(), 10) || '360'
                });
            }
            return options;
        },
        getCode: function () {
            var options = VD.getOptions(),
                code = '[viidea';
            $.each(options, function (key, val) {
                if (val === null) return;
                if (val === true) val = 'Yes';
                if (val === false) val = 'No';
                code += ' ' + key + '="' + val + '"';
            });
            code += ']';
            return code;
        },
        preview: function () {
            var options;
            if (VD._timeout) clearTimeout(VD._timeout);
            try {
                options = VD.getOptions();
                VD.showError();
            } catch (e) {
                VD.showError(''+e);
                return;
            }
            var url = options.hostname + '/' + options.slug + '/',
                el;

            if (options.type == 'popup') {
                url += 'embed.js?';
                if (options.html5) url += 'html5=1&';
                if (options.tabs) url += 'tabs=1&';
                url += 'destination=%23viidea-preview';
                el = $('<script>').attr({src: url});

                VD._timeout = setTimeout(function () {
                    if ($('#viidea-preview .viidet').length == 0) {
                        VD.showError('Video not found (wrong url)');
                        $('#viidea-preview').hide();
                    }
                },5000);
                $('#viidea-preview').empty().show().append(el);
            } else if (options.type == 'iframe') {
                url += 'iframe/1/?';
                if (options.html5) url += 'html5=1&';
                el = $('<iframe>').attr({
                    src: url,
                    width: options.width,   // NO not in preview @TODO
                    height: options.height,
                    frameborder: '0',
                    mozallowfullscreen: '1',
                    webkitallowfullscreen: '1',
                    scrolling: 'no'
                });
                $('#viidea-preview').empty().show().append(el);
            }
        },
        insert: function () {
            try {
                tinyMCEPopup.editor.execCommand('mceInsertRawHTML', false, VD.getCode());
                tinyMCEPopup.close();
            } catch (e) {
                VD.showError(''+e);
            }
        },
        debounce: function (func, threshold, execAsap) {
            var timeout;
            return function debounced () {
                var obj = this,
                    args = arguments;
                function delayed () {
                    if (!execAsap) func.apply(obj, args); // execute now
                    timeout = null; 
                };
                if (timeout) clearTimeout(timeout);
                else if (execAsap) func.apply(obj, args); // execute now
                timeout = setTimeout(delayed, threshold || 100); 
            };
        }
    };
    VD.preview = VD.debounce(VD.preview);
    return VD;
}(jQuery));

tinyMCEPopup.onInit.add(ViideaDialog.init, ViideaDialog);