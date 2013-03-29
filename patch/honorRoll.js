var Patch = (typeof Patch != "undefined") ? Patch : {};
Patch.honorRoll = function() {
	var container = $('#wrapHonorRoll'),
		feedContainer, 
		sidebar,
		html = '<div id="wrapHonorRoll">';		
	var createHonorRoll = function(json) {
		if ($(json.honoritem).length) {
			html += '<h6 class="sidebarTitle honorRollTitle">Honor Roll</h6>';
			html += '<div class="clearfix" id="honorRollFeed">';
			html += '<div class="honorRollFeedInner clearfix">';
			var num = 0,
				itemHtml = '';
			$(json.honoritem).each(function(index, honoritem) {
				// First check if donation amount is greater than zero (pending donations):
				if (parseInt(honoritem.amount) > 0) {
					// Then, check if pledge entry:
					if (honoritem.namefrom.indexOf('From')>-1 && honoritem.nameto.indexOf('From')>-1) {
						num = num+1;
						itemHtml += '<li class="honorItem pledgeItem"><div class="gutter">'
							+ '<span class="honorAmount">'+FAF.Methods.formatCurrencyWSymbol(honoritem.amount)+'</span>'
							+ '<span class="honorNameFrom">'+honoritem.nameto.replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' ')+'</span><br />'
							+ '<span class="honorNameTo"></span>'
							+ '</div></li>';
					} else
					if (honoritem.scrolltypeid == 1) {
						num = num+1;
						itemHtml += '<li class="honorItem"><div class="gutter">'
							+ '<span class="honorAmount">'+FAF.Methods.formatCurrencyWSymbol(honoritem.amount)+'</span>'
							+ '<span class="honorNameFrom">'+honoritem.namefrom.replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' ')+'</span><br />'
							+ '<span class="honorNameTo">'+honoritem.nameto+'</span>'
							+ '</div></li>';
					} else
					if (honoritem.scrolltypeid == 2) {
						num = num+1;
						itemHtml += '<li class="honorItem"><div class="gutter">'
							+ '<span class="honorAmount"></span>'
							+ '<span class="honorNameFrom">'+honoritem.namefrom.replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' ')+'</span><br />'
							+ '<span class="honorNameTo">'+honoritem.nameto+'</span>'
							+ '</div></li>';
					}
				}
			});
			html += '<ul class="honorRollList">' + itemHtml + '</ul>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			$(window).load(function() {
				sidebar.find('#shareThis').before(html);
			});
			if (num > FAF.Options.honorRoll.count) {
				feedContainer.after('<div id="honorRollControls"><a href="#" id="ticker-previous">Previous</a> / <a href="#" id="ticker-next">Next</a> / <a id="ticker-stop" href="#">Stop</a> / <a id="ticker-start" href="#">Start</a></div>');
				feedContainer.find('.honorRollFeedInner').totemticker({
					row_height: '63px',
					next: '#ticker-next',
					previous: '#ticker-previous',
					stop: '#ticker-stop',
					start: '#ticker-start',
					speed: 1200,
					interval: 5000,
					max_items: FAF.Options.honorRoll.count
				});
			}
		}
	};
	// if the custom honor roll doesn't exist: (we do this check so that there won't be any conflicts when the product is updated)
	if (!container.length) {
		// if we're on the general donation page
		if (location.href.indexOf('donorPledge.asp?supId=0')>-1) {
			sidebar = $('#contentTertiary');
			var script = sidebar.find('div.leaderboard').has('script').html();
			if (script != null) {
				var javaHR1 = script.split('document.write("')[1].split('");')[0].replace(/\\"/g,"'");
				var namelist = javaHR1.split("'NameList'")[1].split("'>")[0].split("='")[1];
					namelist = unescape(escape(namelist).replace(/%A0/g,""));
				var names = namelist.split("|"),
					nameout = '', 
					fullname = [],
					honorlist = {};
				honorlist.honoritem = [];
				for (var i = 0; i < names.length; i++) {
					names[i] = $.trim(names[i]);
					if (nameout.indexOf(names[i]) == -1) {
						honorlist.honoritem[i] = {
							"amount"		: "",
							"namefrom"		: "",
							"nameto"		: "",
							"scrolltypeid"	: "1"
						}
						honorlist.honoritem[i]['amount'] = names[i].split('~')[1].split('.')[0].replace(/[^0-9]/g, '');
						honorlist.honoritem[i]['namefrom'] = names[i].split('~')[2];
						honorlist.honoritem[i]['nameto'] = names[i].split('~')[4];
						if (honorlist.honoritem[i]['amount'] == ''){
							honorlist.honoritem[i]['scrolltypeid'] = "2";
						}
					}
				}
				createHonorRoll(honorlist);
			}
		}
	}
}
$(document).ready(function(){
Patch.honorRoll();
});