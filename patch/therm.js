var Patch = (typeof Patch != "undefined") ? Patch : {};
Patch.formatCurrency = function(num) {
	var num = num.toString().replace(/\$|\,/g,'');
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
		num = num.substring(0,num.length-(4*i+3))+','+num.substring(num.length-(4*i+3));
	return ((('$')?'':'-') + '$' + num);
};
Patch.therm = function() {
	var goalContainer = $('#fundbar').find('td.fundbarGoal div.fundValue');
	var goalValue = goalContainer.attr('amount');
	goalContainer.html(Patch.formatCurrency(goalValue));
};
$(document).ready(function(){
Patch.therm();
});