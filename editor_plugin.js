(function() {
	tinymce.create('tinymce.plugins.ViideaPlugin', {

		init : function(ed, url) {
			ed.addCommand('mceViidea', function() {
				ed.windowManager.open({
					file : url + '/dialog.htm',
					width : 800,
					height : 700,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
				});
				
			});

			ed.addButton('viidea', {
				title : 'embed Viidea video',
				cmd : 'mceViidea',
				image : url + '/img/viidea.png'
			});


			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setActive('viidea', n.nodeName == 'IMG');
			});
		},

		createControl : function(n, cm) {
			return null;
		},
		
		getInfo : function() {
			return {
				longname : 'Viidea embed Plugin',
				author   :  'Viidea',
				authorurl : 'http://viidea.com',
				infourl : 'http://viidea.com',
				version : "0.1"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('viidea', tinymce.plugins.ViideaPlugin);
})();