/*
====================================================================
 Blackbaud ISD Sphere Friends Asking Friends Custom Script
--------------------------------------------------------------------
 Author(s): 	Steve Brush [SB]
 Product(s):	Sphere Friends Asking Friends
 Created: 		Spring 2012
-------------------------------------------------------------------- 
 Changelog: 
====================================================================
 08/16/2012		Added sponsor scroller code to the cleanup() function [SB]
 				Updated jQuery selectors for hiding honor roll table in Firefox, cleanup()
 				Fixed issue with .trim() function that was breaking honor roll function in rewritePersonalPage() and rewriteTeamPage()
 				
 10/09/2012		Fixed checkLogin() function for sponsorship forms
 				Fixed facebook() function to provide a URL Facebook can easily archive
 				
====================================================================
*/

FAF = {

    Config: {
        version: '3.0.9',
        lastRevised: '02/09/2012',
        packageType: "essentials"
    },

    Defaults: {
        tools: {
            buttonControl: true,
            logoControl: true,
            colorControl: true
        },
        currency: '$',
        eventName: null,
        facebook: {
            appId: 190219204354402,
            link: null,
            feedTitle: "Recent Activity:",
            hideAll: false,
            hideComments: false,
            hideLikeButton: false,
            hideNewsFeed: false
        },
        sharePage: {
            appId: 'b9f10667-d94c-4fbb-a8e9-acf67b7a118c',
            title: 'Share This Page',
            services: 'facebook,twitter,email',
            hideAll: false
        },
        twitter: {
            appId: 'blackbaud',
            title: 'Find us on Twitter',
            link: null,
            count: 6,
            hide: false
        },
        youTube: {
            title: 'Watch Our Video',
            link: null,
            embedCode: null
        },
        therm: {
            customGoal: null,
            minWidth: 0,
            hide: false,
            hideGoal: false,
            hideRaised: false,
            hideDaysLeft: false,
            hideGiveButton: false
        },
        honorRoll: {
            count: 6,
            hide: false
        },
        loadCss: true,
        design: {
            template: 1,
            pattern: 'gradient',
            colors: {
                buttons: null,
                canvas: null,
                primary: null,
                secondary: null
            }
        }
    },

    Methods: {

        initialize: function(callback) {
            FAF.Options = $.extend(FAF.Defaults, FAF.Options);
            FAF.eID = this.getUrlVars()['ievent'];
            FAF.sID = this.getUrlVars()['supid'];
            FAF.tID = this.getUrlVars()['team'];
            FAF.protocol = window.location.protocol;
            FAF.host = window.location.host;
            FAF.root = FAF.protocol + '//' + FAF.host;
            FAF.path = FAF.protocol + '//' + FAF.host + window.location.pathname;
            FAF.thisURL = window.location.href.toLowerCase();
            FAF.isLoggedIn;

            // Post Facebook SDK
            this.initFacebook();

            this.fetchJSON(callback);
        },

        fetchJSON: function(callback) {
            $.ajax({
                url: '/faf/json/event.asp?ievent=' + FAF.eID,
                dataType: 'jsonp',
                crossDomain: true,
                success: function(data) {
                    FAF.Data = data;
                    if (callback != undefined) {
                        callback(); // run callback functions
                    }
                }
            });
        },

        cleanup: function() {

            // Add class to required field markers
            $('font:contains("*")[color="#FF0000"]').addClass('FAFFormRequiredFieldMarker');
            $('font:contains("*")[color="#ff0000"]').addClass('FAFFormRequiredFieldMarker');
            $('font:contains("*")[color="red"]').addClass('FAFFormRequiredFieldMarker');

            $('font:contains("Incorrect Login: Please try again.")').addClass('FAFFormRequiredFieldMarker');
            $('font:contains("There has been an error processing your transaction. Please check your credit card information and billing address and try again, or contact your credit card issuer.")').addClass('FAFFormRequiredFieldMarker');

            $("li:empty").addClass("myHQbodyli");
            $("td").each(function() {
                if ($(this).attr("align") != null) $(this).css("text-align", $(this).attr("align"));
            });
            $("td").each(function() {
                if ($(this).attr("valign") != null) $(this).css("vertical-align", $(this).attr("valign"));
            });
            $('.FAFBodyTable table').each(function() {
                if ($(this).width() > 695)
                    $(this).wrap("<div class='tablescroll'></div>");
            });

			$(".eventLogo img").each(function() {
                var max_w = 325;
                var max_h = 142;
                var m1 = max_w / max_h;
                var m2 = $(this).width() / $(this).height();
                if (m2 > m1) {
                    $(this).width(max_w);
                } else {
                    $(this).height(max_h);
                }
            });

            if (location.href.indexOf('faf/home/default.asp') > -1) {
                $("h1,h2,.BodyTextFont,h3").addClass("fixtitelwidth")

            };
            
            // Fix the height of the Colorbox and Sharethis transparent overlays
            if ($.browser.msie) { setTimeout(function() { $('#cboxOverlay, #stOverlay').css('height', $(document).height()); }, 2000); }

            // Add classes to MY HQ
            $('.highlighttitlemenu, .highlighttitlemenugame').closest('table').parent().closest('table').attr('id', 'myHQnav').hide();
            $('#myHQnav').closest('tr').next().find('table:first').attr('id', 'myHQbody');
            if (location.href.indexOf('donorReg/donorPledge.asp') == -1) {
                $('#myHQnav').closest('#contentPrimary').closest('.gutter').attr('id', 'wrapMyHQ');
            }

            // Rewrite MyHQ menu
            if ($('.highlighttitlemenu').length || $('.highlighttitlemenugame').length) {
                var menuHtml = '<ul id="myHQmenu" class="clearfix">';
                $('#myHQnav table:first td').each(function() {
                    var thisClass = '';
                    var text = $.trim($(this).text().replace('KnowledgeGame', 'Knowledge Game'));
                    var link = ($(this).find('a').length) ? $(this).find('a').attr('href') : "#";
                    var styles = (typeof $(this).attr('bgcolor') != "undefined") ? 'background-color:' + $(this).attr('bgcolor') + ';' : '';
                    if ($(this).hasClass('highlighttitlemenu')) {
                        thisClass = ' class="highlighttitlemenu"';
                    } else {
                        thisClass = ' class="subnav"';
                    }
                    if (text != "" && text != "&nbsp;") {
                        menuHtml += '<li' + thisClass + '><a href="' + link + '" style="' + styles + '">' + text + '</a></li>';
                    }
                });
                menuHtml += '</ul>';
                $('#myHQnav').after(menuHtml);
                $('#myHQmenu li:last').addClass('logout');

                // Rewrite submenu
                menuHtml = '<ul id="myHQsubmenu" class="menuSub clearfix">';
                $('#myHQnav table:last a').each(function() {
                    text = $.trim($(this).text());
                    link = $(this).attr('href');
                    var target = (text.match('View')) ? ' target="_blank"' : '';
                    menuHtml += '<li><a href="' + link + '"' + target + '>' + text + '</a></li>';
                });
                menuHtml += '</ul>';
                $('#myHQmenu').after(menuHtml);
                $('#myHQsubmenu li:last').addClass('logout');
            }

            // MyHQ Reports table
            $('.lr-listtbl').closest('div').addClass('reportsContainer');

			// MyHQ Edit Personal Page edits:
			

            // Email History Log
            if (location.href.indexOf('faf/email/emailLog.asp') > -1) {
                var bustedContainer = $('h4').closest('td').html('<br /><center><h4>Email History Log</h4></center><p>Use this email log to check who you have sent email to and how they have responded. To re-send emails to individuals, check the box next to their names and click the link at the bottom.</p><p>Click <a onclick="updateLog();" href="#">Update Log</a> to view the most recent email log information.</p>');
                formPointer = document.emailLogForm; // Reset the FAF formPointer variable
            }

            // Honor roll in Firefox:
            if (location.href.indexOf('/faf/donorReg/donorPledge.asp')>-1) {
                $('.leaderboard td.white:contains("Honor Roll")').closest('.leaderboard').hide();
            }
            
            // Sponsor Scroller
			if (typeof sponsorSeries != "undefined" && location.href.indexOf('/faf/home/default.asp')>-1) {
			
				//$('<table class="sponsorTable" cellpadding="0" cellspacing="0"><tr><td class="sponsorHeader">Special Thanks To:</td></tr><tr><td class="sponsorLogos"><div id="sponsorSlides"></div></td></tr></table>').prependTo('#contentTirtiary .gutter');
			
				var sponsorHtml = '<div id="sponsorScroll"><h6 class="sidebarTitle sponsorTitle">Special Thanks To:</h6><div class="sponsorBox"></div></div>';
				$('#contentTertiary .sponsorScroll').before(sponsorHtml);
			
				for (var i=0;i<sponsorSeries.length;i++) {
					$('<div class="slide"><a href="'+sponsorRealUrl[i]+'"><img src="/AccountTempFiles'+sponsorSeries[i]+'" alt="'+sponsorCompanyName[i]+'" /></a></div>').appendTo('#sponsorScroll .sponsorBox');
				}
				
				setTimeout(function() {
					$('.sponsorBox img').each(function() {
						var containerWidth = $('#contentTertiary .slide:eq(0)').width();
						var containerHeight = $('#contentTertiary .slide:eq(0)').height();
						var imageWidth = $(this).width();
						var imageHeight = $(this).height();
						if (imageWidth > imageHeight) { 
							$(this).addClass('forceWidth'); 
						} else if (imageWidth < imageHeight) {
							$(this).addClass('forceHeight');
						} else {
							$(this).addClass('forceWidth');
						}
					});
					$('.sponsorBox .slide').css('visibility','visible');
					$('.sponsorBox').cycle();
				},2000);
			}

            // Remove 'nowrap'
            $('td[noWrap], td[nowrap]').removeAttr('noWrap').removeAttr('nowrap');
        },

		initMiniLogin: function() {
			// Add events to mini login form
            $("#loginLink").click(function(){
				if ($("#loginForm").is(":hidden")){
					$("#loginForm").slideDown("normal");
					$('a#loginLink span').text('Close');
					$(this).addClass('loginLinkClose');
				} else {
					$("#loginForm").slideUp("normal");
					$('a#loginLink span').text('Sign In');
					$(this).removeClass('loginLinkClose');
				}
				return false;
			});
		},

        initFacebook: function() {
            $(document).ready(function() {
                if (typeof fafJSONoptions.facebook != "undefined") {
                    var f = fafJSONoptions.facebook;
                    var appID = (typeof f.appId != "undefined" && f.appId != "") ? f.appId : FAF.Options.facebook.appId;
                    var facebookHtml = ' \
						<div id="fb-root"></div> \
						<script>(function(d, s, id) { \
						  var js, fjs = d.getElementsByTagName(s)[0]; \
						  if (d.getElementById(id)) return; \
						  js = d.createElement(s); js.id = id; \
						  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=' + appID + '"; \
						  fjs.parentNode.insertBefore(js, fjs); \
						}(document, "script", "facebook-jssdk"));</script>';
                    $('body').prepend(facebookHtml);
                }
            });
        },

        getUrlVars: function() {
            var vars = {};
            var parts = window.location.href.toLowerCase().replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                vars[key] = unescape(value.replace(/\+/g, " "));
            });
            return vars;
        },

        checkLogin: function() {
            function getLoginState() {
            	// don't do the check on the sponsorship forms; breaks for some reason...
				if (location.href.indexOf('/faf/SponsorSSL/OrderReview.asp?')==-1 && location.href.indexOf('/faf/SponsorSSL/OrderOK.asp')==-1) {
					$.get('/faf/login/partMenu.asp?ievent=' + FAF.eID, function(data) {
						if ($(data).find('#contentPrimary > .gutter > table .highlighttitlemenu').length > 0) {
							FAF.isLoggedIn = true;
						} else {
							FAF.isLoggedIn = false;
						}
					});
				} else {
					FAF.isLoggedIn = false;	
				}
            }
            // Check FAF login status
            if ($('#contentSecondary .globalNav').length) {
                if (!$('#contentSecondary .globalNav a:contains("Main Login")').length) {
                    getLoginState();
                } else {
                    FAF.isLoggedIn = false;
                }
            } else {
                getLoginState();
            }
        },

        rewritePersonalPage: function() {

            if (FAF.thisURL.indexOf('donorpledge.asp') > -1) {

                var ppContainer = $('#contentPrimary .gutter');
                var ppHtml = "";

                var ppBodyTable = $('.FAFBodyTable').html(),
					br = new RegExp("\\<(br|BR)+\\>", "g"),
					regamount = new RegExp("\\(\\$.+\\+\\)"),
					ppNonprofitName,
					ppDonorform,
					ppDonateLevels = '';

                var txt = {
                    //fbTitle: 'Leave an encouraging note for',
                    raised: 'Dollars Raised',
                    goal: 'My Personal Goal',
                    daysleft: 'Days Left To Give',
                    teamlink: 'View My Team Page',
                    teamlinkButton: 'Join My Team',
                    donation: 'Make a Donation',
                    givinglevels: 'Please select a giving level below:',
                    givingamt: 'Please enter a donation amount below:',
                    otheramt: 'Other Amount:',
                    amt: 'Amount:',
                    honorroll: 'Honor Roll',
                    givebtn: 'Give Now',
                    givebtnGen: 'Giving Stats',
                    goalachieved: 'Goal Achieved!',
                    goalsurpassed: 'Goal Surpassed!',
                    printalt: 'If you are unable to donate online, please print out a donation form.'
                };

                var p = jQuery.extend({}, fafJSONparticipant);
                var e = fafJSONevent;
                p.appealExtras = fafJSONevent.personalpage.pageextras;
                p.CustomLinkName = fafJSONevent.personalpage.customlinkname;
                p.CustomLinkUrl = fafJSONevent.personalpage.customlinkurl;
                p.PrintName = fafJSONevent.labels.printabledonation;
                p.PrintUrl = fafJSONevent.labels.printabledonationurl;

                // Add ID to container
                $('.container').attr('id', 'personalPage');

                // Title
                if (p.heading1 != "") ppHtml += '<h1 class="personalPageTitle">' + p.heading1 + '</h1>';

                // Subtitle
                if (p.heading2 != "") ppHtml += '<h2 class="personalPageSubtitle">' + p.heading2 + '</h2>';

                // Like
                if (fafJSONoptions.facebook.hideLikeButton != "true") {
                    ppHtml += '<div class="fb-like" data=href="' + location.href + '" data-send="true" data-width="450" data-show-faces="false"></div>';
                }

                // Personal Image/Video
                if ((p.image1 !== '') && (p.image2 !== '')) {
                    ppHtml += '<span class="personalImage"><img class="imageFrame" src="' + p.image1 + '" alt="' + p.name + ' Personal Image" /><span class="personalImageCaption">' + p.caption + '</span></span><span class="personalImage"><img class="imageFrame" src="' + p.image2 + '" alt="' + p.name + ' Personal Image" /></span>';
                } else if (p.image1 !== '') {
                    if (p.image1.indexOf('youtube.com') > 0) {
                        ppHtml += ($.browser.msie) ? '<div class="personalVideo"><object width="240" height="150"><param name="movie" value="' + p.image1 + '"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><param name="wmode" value="opaque"></param><embed src="' + p.image1 + '" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque" width="240" height="150"></embed></object></div>' : '<span class="personalVideo"><object width="240" height="150"><param name="movie" value="' + p.image1 + '"><param name="allowFullScreen" value="true"><param name="allowscriptaccess" value="always"><param name="wmode" value="opaque"><embed src="' + p.image1 + '" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque" width="240" height="150"></object></div>';
                    } else {
                        ppHtml += '<span class="personalImage"><img class="imageFrame" src="' + p.image1 + '" alt="' + p.name + ' Personal Image" /><span class="personalImageCaption">' + p.caption + '</span></span>';
                    }
                }

                // Appeal Message
                ppHtml += '<div class="description">';
                ppHtml += (p.appealExtras != '' && typeof p.appealExtras != "undefined") ? '<p class="personalAppeal appealExtras clearfix">' + p.appealExtras + '</p><p class="personalAppeal appealMessage clearfix">' + p.appeal + '</p>' : '<p class="personalAppeal appealMessage clearfix">' + p.appeal + '</p>';
                ppHtml += '</div>';

                // Utility Menu
                // Team Page Link
                if ((typeof p.teampagelink != "undefined") && (p.teampagelink !== '')) {
                    p.utilityHtml += '<li class="teamPageTxt"><a href="' + p.teampagelink + '">' + txt.teamlink + '&nbsp;&#155;</a></li>';
                }

                // Custom Link
                if (p.CustomLinkName != '' && p.CustomLinkUrl != '' && typeof p.CustomLinkName != "undefined" && typeof p.CustomLinkUrl != "undefined") {
                    p.utilityHtml += '<li class="personalCustomLink"><a href="' + p.CustomLinkUrl + '">' + p.CustomLinkName + '&nbsp;&#155;</a></li>';
                }

                // Print Donation Form Link
                var printTable = $(ppBodyTable).find('table table table table td:contains("If you are unable to donate online")');
                if (printTable.length > 0) {
                    if (printTable.find('a').attr('onclick').toString().indexOf('tmpval=y') > 0) {
                        var printpdf = 'y';
                    } else { var printpdf = '' }
                    if (printTable.find('a').attr('onclick').toString().indexOf('&o=L') > 0) {
                        var printorient = '&o=L';
                    } else { var printorient = '' }

                    if (printTable.find('a').attr('onclick').toString().indexOf('&tmpTID=0') > 0) {
                        var printTID = '&tmpTID=0';
                    } else { var printTID = '' }
                    if (printTable.find('a').attr('onclick').toString().indexOf('&isPer=y') > 0) {
                        var printIsPer = '&isPer=y';
                    } else if (printTable.find('a').attr('onclick').toString().indexOf('&isPer=n') > 0) {
                        var printIsPer = '&isPer=n';
                    } else { var printIsPer = '' }
                    if (printTable.find('a').attr('onclick').toString().indexOf('&isFam=y&famid=') > 0) {
                        var printFam = '&isFam=y&famid=';
                        var ipos = printTable.find('a').attr('onclick').toString().indexOf('&isFam=y&famid=');
                        var iend = printTable.find('a').attr('onclick').toString().substring(ipos).indexOf('\'');
                        var famid = printTable.find('a').attr('onclick').toString().substring(ipos).substring(0, iend).replace("&isFam=y&famid=", "")
                        printFam += famid;
                    } else { var printFam = '' }

                    if (p.PrintUrl != '') {
                        if (printpdf == 'y') {
                            p.PrintHtml = '<div class="printNotice"><a href="#" onclick="javascript:window.open(\'' + FAF.root + '/faf/tools/donationform.asp?ievent=' + FAF.eID + '&tmpid=' + p.sid + '&tmpval=' + printpdf + printorient + '&customlinkForPdf=' + encodeURIComponent(p.PrintUrl) + printTID + printIsPer + printFam + '\',\'reg\',\'menubar=yes,scrollbars=yes,resizable=yes\')">' + p.PrintName + '</a></div>'
                        } else {
                            p.PrintHtml = '<div class="printNotice"><a href="#" onclick="javascript:window.open(\'' + p.PrintUrl + '?ievent=' + FAF.eID + '&tmpid=' + p.sid + '&tmpval=' + printpdf + printorient + printTID + printIsPer + printFam + '\',\'reg\',\'menubar=yes,scrollbars=yes,resizable=yes\')">' + p.PrintName + '</a></div>'
                        }
                    } else {
                        p.PrintHtml = '<div class="printNotice"><a href="#" onclick="javascript:window.open(\'' + FAF.root + '/faf/tools/donationform.asp?ievent=' + FAF.eID + '&tmpid=' + p.sid + '&tmpval=' + printpdf + printorient + printTID + printIsPer + printFam + '\',\'reg\',\'menubar=yes,scrollbars=yes,resizable=yes\')">' + p.PrintName + '</a></div>'
                    }

                } else { p.PrintHtml = '' }

                // Facebook comments
                ppHtml += '<div id="facebookComments"></div>';

                // Donation Form		
                ppDonorform = $(ppBodyTable).find('input[name=level]').closest('table');
                ppDonorform.find('input[name=level]').closest('tr').each(function() {
                    var input = $(this).find('td:eq(0)').html();
                    var text = $(this).find('td:eq(1)').html();
                    if ((typeof text !== 'undefined') && (text !== null) && (text !== 0)) {
                        text = text.replace(br, " ");
                        text = text.match(regamount);
                        if ((typeof text !== 'undefined') && (text !== null) && (text !== 0)) {
                            text = text[0].replace("(", "");
                            text = text.replace(" +)", "");
                            var textFmt = FAF.Methods.formatCurrencyWSymbol(text);
                        } else { textFmt = ''; }
                    }
                    var label;
                    if ($(this).find('td:eq(1) a').length > 0) {
                        label = $(this).find('td:eq(1) a').html()
                        if ((typeof label !== 'undefined') && (label !== null) && (label !== 0)) {
                            label.split(br)[0];
                        };
                    } else {
                        label = $(this).find('td:eq(1) b').html()
                        if ((typeof label !== 'undefined') && (label !== null) && (label !== 0)) {
                            label.split(br)[0];
                        };
                    }
                    ppDonateLevels += '<li>' + input + '<label for="transaction"><span class="transtext"><span class="amt">' + textFmt + '</span> ' + label + '</span></label></li>';
                });
                ppDonateLevels += '<li><input name="level" type="radio" /><label for="transaction"><span class="transtext">' + txt.otheramt + ' </span><span id="donateAmount"></span></label></li>';

                var ppDonateLevelsAlt = '<li><input name="level" type="radio" /><label for="transaction"><span class="transtext">' + txt.amt + ' </span><span id="donateAmount"></span></label></li>';

                if (($(ppBodyTable).find('input[name=level]').length > 0) && ($(ppBodyTable).find('input[name=level]').val() != 0)) {
                    var ppDonateLevelsHtml = '<p class="info">' + txt.givinglevels + '</p><div id="givingLevels"><ol class="options">' + ppDonateLevels + '</ol></div>';
                } else {
                    var ppDonateLevelsHtml = '<p class="info">' + txt.givingamt + '</p><div id="givingLevels"><ol class="options">' + ppDonateLevelsAlt + '</ol></div>';
                }

                // Giving Overlay:
                ppHtml += '<div id="givingOverlay"><div id="givingOverlayInner" class="clearfix">'
                ppHtml += '<form name="registrationForm" class="registrationForm" action="" method="POST"><h4>' + txt.donation + '</h4>' + ppDonateLevelsHtml + '<div id="donateButton"></div>' + p.PrintHtml + '</form>'
                ppHtml += '</div></div>'

                // Append all HTML:
                $(ppHtml).appendTo(ppContainer);

                // Additional Modifications:
                // -------------------------
                // Remove link around giving level labels
                $('#givingLevels .options .transtext a b').unwrap();
                $('#givingLevels .options li label, #givingLevels .options li span.otheramount').click(function() {
                    $(this).prev('input').click();
                    return false;
                });

                // Donation form submit button
                $('form[name=registrationForm]:eq(0)').addClass('oldregform');
                $('.registrationForm').attr('onSubmit', 'return formCheck()');
                $('.registrationForm').attr("action", $('form[name=registrationForm]:first').attr('action'));
                $('.registrationForm ol').after($('.FAFBodyTable input[type=hidden]'));
                $('#donateAmount').append($('input[name=addAmount]'));
                $('#donateAmount input[name=addAmount]').attr('onblur', '');
                $('#donateAmount input[name=addAmount]').keydown(function() {
                    $(this).closest('label').prev('input').click();
                });

                setTimeout(function() {
                    if ($.colorbox) $('#giveNowButton .bigButton').colorbox({ href: "#givingOverlay", width: "550px", maxWidth: "100%", /*height:"470px",*/height: "50%", maxHeight: "700px", inline: true, opacity: 0.75 });
                }, 10);

                // Add the new Donate button image to the donate button		
                if ($('input[name="donateToSelfCheckbox"]').length > 0) {
                    $('#donateButton').html($('input[name="donateToSelfCheckbox"]').closest('table').parent().html());
                } else {
                    $('#donateButton').html($('input[name=imageField]').closest('td').html());
                }
                $('#donateButton input').removeAttr("width").removeAttr("height");
                $('#donateButton input[name="imageField"]').hide();
                var donateHtml = '<input type="button" border="0" name="imageFieldNew" id="donateSubmit" value="Donate &raquo;">';

                $('#donateButton').append(donateHtml);

                $('#donateSubmit').click(function() {
                    if (formCheck() == true) {
                        $('#donateButton input[name="imageField"]').click()
                    }
                })
                $('#donateButton br').remove();

                //done with old reg form - remove it
                $('.oldregform').remove();

                // Make the page look different for General Donations
                if (FAF.sID == 0 && (FAF.tID == null || FAF.tID == '' || FAF.tID == 0)) {
                    $('#fundraisingThermometer').after('<div id="givingInnerlay" />');
                    $('#givingInnerlay').append($('#givingOverlayInner'));
                    $('#giveNowButton').hide();
                }

                // Set form pointers
                $('.registrationForm').attr('name', 'registrationForm');
                window.formPointer = document.registrationForm;
                window.newFormElement = $('form.registrationForm');

                // Hide and remove elements for the General Donation form if they don't exist or are undefined
                if (((FAF.sID == 0)) && ((typeof FAF.tID == 'undefined') || (FAF.tID == null) || (FAF.tID == 0))) {
                    $('#fundraisingThermometer, h2.totalRaised, .nonprofitName').hide();
                }
                if ((typeof FAF.sID == 'undefined') || (FAF.sID == null)) {
                    $('#facebookComments, #socialSharingWrap').hide();
                    $('table.FAFOuterTable2').before('<div id="wrapAlertBar"><div id="alertBar">Your Personal Page Preview - <a href="' + FAF.root + '/faf/login/page_edit.asp?login=lmenu&ievent=' + FAF.eID + '">[EDIT]</a></div></div>');
                }


                /* --------- */
                /*  SIDEBAR  */
                /* --------- */

                var ppSidebar = $('#contentTertiary .gutter');

                $('<div class="sidebarBox" />').prependTo(ppSidebar);

                // Donation Button
                $('<div class="dataRow clearfix row1"><div id="giveNowButton"><a class="bigButton" href="#givingOverlay">' + txt.givebtn + '</a></div></div>').appendTo('.sidebarBox');

                // Team Page link 2
                if ((typeof p.teampagelink != "undefined") && (p.teampagelink !== '')) {
                    p.teampagelinkHtml2 = '<div id="teamPageButton"><a class="teamPageLink smallButton" href="' + p.teampagelink + '">' + txt.teamlinkButton + '</a></div>';
                    $(p.teampagelinkHtml2).appendTo('.sidebarBox .row1');
                }

                // Fund Goal
                if ((typeof p.goal !== 'undefined') && (p.goal !== null)) {
                    p.goalFmt = FAF.Methods.formatCurrencyWSymbol(parseInt(p.goal));
                }
                if ((typeof p.goalFmt !== 'undefined') && (p.goalFmt !== null)) {
                    p.goalFmtHtml = '<div class="dataRow clearfix row2"><span class="dataRowLabel">' + txt.goal + '</span><span class="dataRowValue">' + p.goalFmt + '</span></div>'
                    p.goalFmtNum = p.goalFmt;
                    $(p.goalFmtHtml).appendTo('.sidebarBox');
                }

                // Total Raised
                if ((typeof p.raised !== 'undefined') && (p.raised !== null)) {
                    p.raisedFmt = FAF.Methods.formatCurrencyWSymbol(parseInt(p.raised));
                }
                if ((typeof p.raisedFmt !== 'undefined') && (p.raisedFmt !== null)) {
                    p.raisedFmtHtml = '<div class="dataRow clearfix row3"><span class="dataRowLabel">' + txt.raised + '</span><span class="dataRowValue">' + p.raisedFmt + '</span></div>'
                    $(p.raisedFmtHtml).appendTo('.sidebarBox');
                }

                // Days Left
                var today = new Date();
                var eventdate = new Date(e.event.startdate)
                var daysleft = Math.floor((Date.parse(eventdate) - Date.parse(today)) / 86400000) + 1;
                if (daysleft > -1) {
                    p.daysLeft = '<div class="dataRow clearfix row4"><span class="dataRowLabel">' + txt.daysleft + '</span><span class="dataRowValue">' + daysleft + '</span></div>';
                    $(p.daysLeft).appendTo('.sidebarBox');
                }

                var fundraisingTherm = '<div class="dataRow clearfix row5"><span class="dataRowLabel">Progress<span class="dataRowPercentage">0%</span></span><span class="dataRowValue"><div id="bar"><span id="bar_progress"></span></div></div></span>';
                $(fundraisingTherm).appendTo('.sidebarBox');
                var raisedPercentage = (parseInt(p.raised) >= parseInt(p.goal)) ? 100 : Math.round(parseInt(p.raised) / parseInt(p.goal) * 100);
                $('.dataRowPercentage').text(raisedPercentage + '%');
                var counterWidth = (parseInt(p.raised) > parseInt(p.goal)) ? '100%' : raisedPercentage + "%";
                $('#bar_progress').css('width', counterWidth);

                // Honor Roll
                $('<h6 class="sidebarTitle honorRollTitle">' + txt.honorroll + '</h6><div id="honorRollFeed" class="clearfix"><div class="honorRollFeedInner clearfix"></div></div>').appendTo(ppSidebar);
                function hideHonorRoll() {
                    $('#eventData .row3').remove();
                    $('.honorRollTitle, #honorRollFeed').remove();
                }
                // Get honor roll to donor count (FAF.sID or fafJSONparticipant.sid)
                if ((typeof fafJSONparticipant.sid !== 'undefined') && (fafJSONparticipant.sid !== null) && (fafJSONparticipant.sid != 0) && (!FAF.Options.honorRoll.hide) && ($.xml2json)) {
                    $.ajax({
                        type: "GET",
                        cache: false,
                        url: '/gadgets/data/honorroll.aspx?sid=' + p.sid + '&eid=' + FAF.eID,
                        dataType: 'html',
                        success: function(honordata) {
                            var json = $.xml2json(honordata);
                            if ($(json.honoritem).length) {
                                var html = '';
                                var num = 0;
                                $(json.honoritem).each(function(index, honoritem) {
                                    // First check if pledge entry:
									if (honoritem.namefrom.indexOf('From')>-1 && honoritem.nameto.indexOf('From')>-1) {
										num = num+1;
										html += '<li class="honorItem pledgeItem"><div class="gutter">'
											+ '<span class="honorAmount">$'+honoritem.amount+'</span>'
											+ '<span class="honorNameFrom">'+honoritem.nameto+'</span><br />'
											+ '<span class="honorNameTo"></span>'
											+ '</div></li>';
									} else
									if (honoritem.scrolltypeid == 1) {
										num = num+1;
										html += '<li class="honorItem"><div class="gutter">'
											+ '<span class="honorAmount">$'+honoritem.amount+'</span>'
											+ '<span class="honorNameFrom">'+honoritem.namefrom+'</span><br />'
											+ '<span class="honorNameTo">'+honoritem.nameto+'</span>'
											+ '</div></li>';
									} else
									if (honoritem.scrolltypeid == 2) {
										num = num+1;
										html += '<li class="honorItem"><div class="gutter">'
											+ '<span class="honorAmount"></span>'
											+ '<span class="honorNameFrom">'+honoritem.namefrom+'</span><br />'
											+ '<span class="honorNameTo">'+honoritem.nameto+'</span>'
											+ '</div></li>';
									}
                                });
                                $('#honorRollFeed .honorRollFeedInner').append('<ul class="honorRollList">' + html + '</ul>');
                                // Remove non breaking space from honor roll from name
                                $('#honorRollFeed .honorNameFrom').each(function() {
                                    $(this).html($(this).html().replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' '));
                                });

                                if (num > FAF.Options.honorRoll.count) {
                                    $('#honorRollFeed').after('<div id="honorRollControls"><a href="#" id="ticker-previous">Previous</a> / <a href="#" id="ticker-next">Next</a> / <a id="ticker-stop" href="#">Stop</a> / <a id="ticker-start" href="#">Start</a></div>');
                                    $('#honorRollFeed .honorRollFeedInner').totemticker({
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
                                // hide if there are no donations, hide honorRoll and totalDonors
                                else if (num <= 0) {
                                    hideHonorRoll()
                                }
                            } else {
                                hideHonorRoll()
                            }
                        },
                        error: function(xhr, textStatus, errorThrown) {
                            hideHonorRoll()
                        }
                    });
                } else { hideHonorRoll() }
            }
        },

        rewriteTeamPage: function() {
            $(document).ready(function() {
                if ((FAF.thisURL.indexOf("search/searchteampart.asp") > -1)
					&& !($.browser.msie && $.browser.version.substr(0, 1) < 7)) {

                    var ppContainer = $('#contentPrimary .gutter');
                    var ppHtml = "";

                    /************************************************************
                    *  Vars
                    ************************************************************/

                    var t = jQuery.extend({}, fafJSONteam);
                    var e = fafJSONevent;
                    t.PrintName = fafJSONevent.labels.printabledonation;
                    t.PrintUrl = fafJSONevent.labels.printabledonationurl;

                    var ppBodyTable = $('.FAFBodyTable').hide().html(),
						br = new RegExp("\\<(br|BR)+\\>", "g"),
						regamount = new RegExp("\\(\\$.+\\+\\)"),
						br1 = new RegExp("\\<(br|BR)+\\>"),
						ppNonprofitName,
						ppDonorform,
						ppDonateLevels = '';

                    var txt = {
                        raised: 'Amount Raised',
                        goal: 'Fundraising Goal',
                        daysleft: 'Days Left To Give',
                        teamlink: 'My ' + e.labels.team + ' Page',
                        donation: 'Make a Donation',
                        givinglevels: 'Please select a giving level below:',
                        givingamt: 'Please enter a donation amount below:',
                        otheramt: 'Other Amount:',
                        amt: 'Amount:',
                        honorroll: 'Honor Roll',
                        givebtn: 'Give Now',
                        givebtnGen: '&laquo; Give Now',
                        goalachieved: 'Goal Achieved!',
                        goalsurpassed: 'Goal Surpassed!',
                        recruitmentgoal: 'Recruitement Goal',
                        teammembers: e.labels.team + ' Members:',
                        teamlist: e.labels.team + ' Members',
                        teamlist2: 'Total Raised',
                        jointeam: 'Join Our ' + e.labels.team
                    };

                    /************************************************************
                    *  Team Page Values
                    ************************************************************/

                    // Add ID to container
                    $('.container').attr('id', 'personalPage');

                    // Personal Page Title (Heading 1)
                    ppHtml += '<h1 class="personalPageTitle">' + t.heading1 + '</h1>';

                    // Personal Page SubHeading (Heading 2)
                    ppHtml += '<h2 id="subHeadingTxt">' + t.heading2 + '</h2>';

                    // Like
                    if (fafJSONoptions.facebook.hideLikeButton != "true") {
                        ppHtml += '<div class="fb-like" data-href="' + location.href + '" data-send="true" data-width="450" data-show-faces="false"></div>';
                    }

                    // Personal Image/Video
                    if ((t.image1 !== '') && (t.image2 !== '') && (t.image2 !== '/AccountTempFiles/')) {
                        ppHtml += '<span class="personalImage"><img class="imageFrame" src="' + t.image1 + '" alt="' + t.name + ' Personal Image" /><span class="personalImageCaption">' + t.caption + '</span></span><span class="personalImage"><img class="imageFrame" src="' + t.image2 + '" alt="' + t.name + ' Personal Image" /></span>';
                    } else if (t.image1 !== '') {
                        if (t.image1.indexOf('youtube.com') > 0) {
                            if ($.browser.msie) {
                                ppHtml += '<span class="personalImage"><object width="240" height="150"><param name="movie" value="' + t.image1 + '"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><param name="wmode" value="opaque"></param><embed src="' + t.image1 + '" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque" width="240" height="150"></embed></object></span><p id="personalImageCaption">' + t.caption + '</p>';
                            } else {
                                ppHtml += '<span class="personalImage"><object width="240" height="150"><param name="movie" value="' + t.image1 + '"><param name="allowFullScreen" value="true"><param name="allowscriptaccess" value="always"><param name="wmode" value="opaque"><embed src="' + t.image1 + '" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque" width="240" height="150"></object></span><p id="personalImageCaption">' + t.caption + '</p>';
                            }
                        } else {
                            ppHtml += '<span class="personalImage"><img class="imageFrame" src="' + t.image1 + '" alt="' + t.name + ' Personal Image" /><span class="personalImageCaption">' + t.caption + '</span></span>';
                        }
                    }

                    // Appeal Message
                    ppHtml += '<div class="description">';
                    ppHtml += '<p class="personalAppeal appealMessage clearfix">' + t.appeal + '</p>';
                    // Group Page link
                    if ((typeof t.grouppagelink !== undefined) && (t.grouppagelink !== '')) {
                        ppHtml += '<p class="groupPageLink"><a href="' + t.grouppagelink + '">Our ' + e.labels.group + ' Page</a></p>';
                    }
                    ppHtml += "</div>";

                    // Team Members Message
                    if ((typeof t.recruitmentgoal !== 'undefined') && (t.recruitmentgoal !== null) && (t.recruitmentgoal !== 0) && (typeof t.membersrecruited !== 'undefined') && (t.membersrecruited !== null) && (t.membersrecruited !== 0)) {
                        var recruitmentGoal = (t.recruitmentgoal == "") ? "1" : t.recruitmentgoal;
                        ppHtml += '<div class="teamMembersMessage">We\'ve recruited <span class="teamMembers">' + t.membersrecruited + '</span> members out of our recruitment goal of <span class="teamGoal">' + recruitmentGoal + '</span> ' + e.labels.team + ' members!</div>';
                    }

                    // Team Members Donations...
                    if ((t.teamdonation !== 'undefined') && (t.teamdonation !== null) && (t.teamdonation !== '')) {
                        t.teamdonationHtml = '<dl class="clearfix"><dt>' + t.teamdonation.name + '</dt><dd>' + FAF.Methods.formatCurrencyWSymbol(t.teamdonation.raised) + '</dd></dl>'
                    } else {
                        t.teamdonationHtml = '';
                    }

                    // Team Captain
                    if ((t.teamcaptain !== 'undefined') && (t.teamcaptain !== null) && (t.teamcaptain !== '')) {
                        t.teamcaptainHtml = '<dl class="clearfix"><dt><a href="' + t.teamcaptain.link + '">' + t.teamcaptain.name + '</a></dt><dd>' + FAF.Methods.formatCurrencyWSymbol(t.teamcaptain.raised) + '</dd></dl>'
                    } else { t.teamcaptainHtml = '' }

                    // Multiple Team Captains
                    if (t.teamcocaptains instanceof Array == true) {
                        t.teamcocaptainHtml = '';
                        $.each(t.teamcocaptains, function(i, val) {
                            t.teamcocaptainHtml += '<dl class="clearfix"><dt><a href="' + val.link + '">' + val.name + '</a></dt><dd>' + FAF.Methods.formatCurrencyWSymbol(val.raised) + '</dd></dl>'
                        })
                    } else {
                        t.teamcocaptainHtml = '';
                    }

                    // Team Members
                    if (t.teammembers instanceof Array == true) {
                        t.teammembmersHtml = '';
                        $.each(t.teammembers, function(i, val) {
                            t.teammembmersHtml += '<dl class="clearfix"><dt><a href="' + val.link + '">' + val.name + '</a></dt><dd>' + FAF.Methods.formatCurrencyWSymbol(val.raised) + '</dd></dl>'
                        })
                    } else {
                        t.teammembmersHtml = '';
                    }
                    ppHtml += '<div id="teamList"><h5><dl class="clearfix"><dt>' + txt.teamlist + '</dt><dd>' + txt.teamlist2 + '</dd></dl></h5><div class="teamDonation">' + t.teamdonationHtml + '</div><div class="captains">' + t.teamcaptainHtml + t.teamcocaptainHtml + '</div><div class="members">' + t.teammembmersHtml + '</div></div>'

                    // Facebook comments
                    ppHtml += '<div id="facebookComments"></div>';

                    // Create donation form:
                    ppHtml += '<div id="givingOverlay"><div id="givingOverlayInner" class="clearfix">'
                    ppHtml += '<form name="registrationForm" class="registrationForm" action="" method="POST"><h4>' + txt.donation + '</h4><div id="givingLevels"><ol class="options"></ol></div><div id="donateButton"></div>' + /*t.PrintHtml+*/'</form>'
                    ppHtml += '</div></div>';

                    // Append HTML to Center Column:
                    ppContainer.append(ppHtml);


                    /************************************************************
                    *  Get Data from Team Donation Page
                    ************************************************************/
                    if ((typeof FAF.tID !== 'undefined') && (FAF.tID !== null) && (FAF.tID != 0)) {
                        $.get('/faf/donorReg/donorPledge.asp?ievent=' + FAF.eID + '&supId=0&team=' + FAF.tID, function(teamdata) {

                            var minDonation = teamdata.split("if(formPointer.elements['addAmount'].value < ")[1];
                            if ((typeof minDonation !== 'undefined') && (minDonation !== null) && (minDonation != 0)) {
                                minDonation = minDonation.split('){')[0];
                                FAF.minDonation = Number(minDonation);
                            }
                            var teamBody = $(teamdata).find('.FAFBodyTable');

                            if (teamBody.html() == null) {
                                var istart = teamdata.toString().indexOf('<div class=\"FAFBodyTable\">');
                                teamdata = teamdata.toString().substring(istart);
                                var iend = teamdata.toString().indexOf('</form>');
                                teamdata = teamdata.toString().substring(0, iend).replace("<div class=\"FAFBodyTable\">", "").replace("</form>", "");
                                var tmpDiv = document.createElement("div");
                                tmpDiv.innerHTML = teamdata;
                                teamBody = null;
                                teamBody = $(tmpDiv)
                            }
                            var formAction = $(teamBody).find('form[name=registrationForm]').attr('action')

                            // Donation Form		
                            var ppDonorform = $(teamBody).find('input[name=level]').closest('table');
                            var ppDonateLevels = ''; // Set Variable
                            ppDonorform.find('input[name=level]').closest('tr').each(function() {
                                if ($(this).find('input[type="radio"]').length > 0) {
                                    var input = $(this).find('td:eq(0)').html();
                                    var text = $(this).find('td:eq(1)').html();
                                    if ((typeof text !== 'undefined') && (text !== null) && (text !== 0)) {
                                        text = text.replace(br, " ");
                                        text = text.match(regamount);
                                        if ((typeof text !== 'undefined') && (text !== null) && (text !== 0)) {
                                            text = text[0].replace("(", "");
                                            text = text.replace(" +)", "");
                                            var textFmt = FAF.Methods.formatCurrencyWSymbol(text);
                                        } else { textFmt = ''; }
                                    }
                                    var label;
                                    if ($(this).find('td:eq(1) a').length > 0) {
                                        label = $(this).find('td:eq(1) a').html();
                                        if ((typeof label !== 'undefined') && (label !== null) && (label !== 0)) {
                                            label.split(br)[0];
                                        };
                                    } else {
                                        label = $(this).find('td:eq(1) b').html();
                                        if ((typeof label !== 'undefined') && (label !== null) && (label !== 0)) {
                                            label.split(br)[0];
                                        };
                                    }
                                    ppDonateLevels += '<li>' + input + '<label for="transaction"><span class="transtext"><span class="amt">' + textFmt + '</span> ' + label + '</span></label></li>';
                                }
                            });
                            ppDonateLevels += '<li><input name="level" type="radio" value=""/><label for="transaction"><span class="transtext otheramount">Other Amount: </span><span id="donateAmount"></span></label></li>';

                            $('#givingLevels .options').append(ppDonateLevels);

                            /************************************************************
                            *  Additional Modifications
                            ************************************************************/

                            // Print Donation Form Link
                            if (teamBody.find('table table table table table td:contains("If you are unable to donate online")').length) {
                                var printpdf = (teamBody.find('table table table table table td:contains("If you are unable to donate online")').find('a').attr('onclick').match('tmpval=y')) ? 'y' : '';
                                var printorient = (teamBody.find('table table table table table td:contains("If you are unable to donate online")').find('a').attr('onclick').match('&o=L')) ? '&o=L' : '';
                                var printHtml = "";
                                if (t.PrintUrl != '') {
                                    if (printpdf == 'y') {
                                        printHtml = '<div class="printNotice"><a href="#" onclick="javascript:window.open(\'' + FAF.root + '/faf/tools/donationform.asp?ievent=' + FAF.eID + '&tmpid=0&tmpval=' + printpdf + printorient + '&customlinkForPdf=' + encodeURIComponent(t.PrintUrl) + '&tmpTID=' + FAF.tID + '&isPer=n' + '\',\'reg\',\'menubar=yes,scrollbars=yes,resizable=yes\')">' + t.PrintName + '</a></div>';
                                    } else {
                                        printHtml = '<div class="printNotice"><a href="#" onclick="javascript:window.open(\'' + t.PrintUrl + '?ievent=' + FAF.eID + '&tmpid=0&tmpval=' + printpdf + printorient + '&tmpTID=' + FAF.tID + '&isPer=n' + '\',\'reg\',\'menubar=yes,scrollbars=yes,resizable=yes\')">' + t.PrintName + '</a></div>';
                                    }
                                } else {
                                    printHtml = '<div class="printNotice"><a href="#" onclick="javascript:window.open(\'' + FAF.root + '/faf/tools/donationform.asp?ievent=' + FAF.eID + '&tmpid=0&tmpval=' + printpdf + printorient + '&tmpTID=' + FAF.tID + '&isPer=n' + '\',\'reg\',\'menubar=yes,scrollbars=yes,resizable=yes\')">' + t.PrintName + '</a></div>';
                                }
                            } else {
                                printHtml = '';
                            }
                            $('form[name="registrationForm"]').append(printHtml);

                            // Remove link around giving level labels
                            $('#givingLevels .options .transtext a b').unwrap();
                            // Add click functions to labels
                            $('#givingLevels .options li label, #givingLevels .options li span.otheramount').click(function() {
                                $(this).prev('input').click();
                                return false;
                            });

                            // Add form properties
                            $('.registrationForm').attr('onSubmit', 'return customFormCheck()');
                            $('.registrationForm').attr("action", formAction);
                            $('.registrationForm ol').after($(teamBody).find('input[type=hidden]'));

                            // Set hidden input js value true
                            $('.registrationForm input[type=hidden][name=js]').attr('value', 'true');

                            $('#donateAmount').append($(teamBody).find('input[name=addAmount]'));
                            $('#donateAmount input[name=addAmount]').attr('onblur', '');
                            $('#donateAmount input[name=addAmount]').keydown(function() {
                                $(this).closest('label').prev('input').click();
                            });

                            // Add the new Donate button image to the donate button		
                            if ($(teamBody).find('input[name="donateToSelfCheckbox"]').length > 0) {
                                $('#donateButton').html($(teamBody).find('input[name="donateToSelfCheckbox"]').closest('table').parent().html());
                            } else {
                                $('#donateButton').html($(teamBody).find('input[name=imageField]').closest('td').html());
                            }
                            $('#donateButton input').removeAttr("width").removeAttr("height");
                            $('#donateButton input[name=imageField]').hide();
                            $('#donateButton').append('<input type="button" border="0" name="imageFieldNew" id="donateSubmit" value="Donate &raquo;">')
                            $('#donateSubmit').click(function() {
                                if (customFormCheck() == true) {
                                    $('#donateButton input[name=imageField]').click()
                                }
                            })
                            $('#donateButton br').remove();

                            // Set form pointers - Does this work?
                            $('.registrationForm').attr('name', 'registrationForm');
                            window.formPointer = document.registrationForm;
                            window.newFormElement = $('form.registrationForm');

                        });
                    }

                    /* SIDEBAR */
                    var ppSidebar = $('#contentTertiary .gutter');
                    var sidebarHtml = '<div class="sidebarBox">';

                    // Join Team Button
                    // Join Our Team link
                    sidebarHtml += '<div class="dataRow clearfix row1">';
                    if ((typeof t.jointeamlink !== undefined) && (t.jointeamlink !== '')) {
                        sidebarHtml += '<div id="giveNowButton"><a class="bigButton" href="' + encodeURI(t.jointeamlink) + '">Join Team</a></div>';
                    }

                    // Donate button:
                    sidebarHtml += '<div id="joinTeamButton"><a class="smallButton" href="#givingOverlay">Donate Now</a></div>';
                    sidebarHtml += '</div>';

                    // Team Goal
                    if ((typeof t.goal !== 'undefined') && (t.goal !== null)) {
                        t.goalFmt = FAF.Methods.formatCurrencyWSymbol(parseInt(t.goal, 10)); // formatted fund goal value
                    }
                    if ((typeof t.goalFmt !== 'undefined') && (t.goalFmt !== null)) {
                        sidebarHtml += '<div class="dataRow clearfix row2"><span class="dataRowLabel">Team Goal</span><span class="dataRowValue">' + t.goalFmt + '</span></div>'
                        t.goalFmtNum = t.goalFmt;
                    } else {
                        t.goalFmtNum = '';
                    }

                    // Team Raised
                    if ((typeof t.raised !== 'undefined') && (t.raised !== null)) {
                        t.raisedFmt = FAF.Methods.formatCurrencyWSymbol(parseInt(t.raised, 10)); // formatted total raised value
                    }
                    if ((typeof t.raisedFmt !== 'undefined') && (t.raisedFmt !== null)) {
                        sidebarHtml += '<div class="dataRow clearfix row3"><span class="dataRowLabel">Team Raised</span><span class="dataRowValue">' + t.raisedFmt + '</span></div>'
                    }

                    // Team Recruitment Goal
                    if ((typeof t.recruitmentgoal !== undefined) && (t.recruitmentgoal !== '')) {
                        sidebarHtml += '<div class="dataRow clearfix row4"><span class="dataRowLabel">Recruitment Goal</span><span class="dataRowValue">' + t.recruitmentgoal + '</span></div>'
                    }

                    // Team Recruitment Raised
                    if ((typeof t.membersrecruited !== undefined) && (t.membersrecruited !== '')) {
                        sidebarHtml += '<div class="dataRow clearfix row5"><span class="dataRowLabel">Total Members</span><span class="dataRowValue">' + t.membersrecruited + '</span></div>'
                    }

                    // Days Left
                    var today = new Date();
                    var eventdate = new Date(e.event.startdate)
                    var daysleft = Math.floor((Date.parse(eventdate) - Date.parse(today)) / 86400000) + 1;
                    if (daysleft > -1) {
                        sidebarHtml += '<div class="dataRow clearfix row6"><span class="dataRowLabel">' + txt.daysleft + '</span><span class="dataRowValue">' + daysleft + '</span></div>';
                    }

                    sidebarHtml += '<div class="dataRow clearfix row7"><span class="dataRowLabel">Progress<span class="dataRowPercentage">0%</span></span><span class="dataRowValue"><div id="bar"><span id="bar_progress"></span></div></div></span>';

                    // Append Sidebar HTML
                    sidebarHtml += "</div>";

                    // Honor Roll
                    sidebarHtml += '<h6 class="sidebarTitle honorRollTitle">Honor Roll</h6><div id="honorRollFeed" class="clearfix"><div class="honorRollFeedInner clearfix"></div></div>';

                    ppSidebar.prepend(sidebarHtml);

                    // Activate therm:
                    if (t.goal == "") { t.goal = 0; }
                    var raisedPercentage = (parseInt(t.raised) >= parseInt(t.goal)) ? 100 : Math.round(parseInt(t.raised) / parseInt(t.goal) * 100);
                    $('.dataRowPercentage').text(raisedPercentage + '%');
                    var counterWidth = (parseInt(t.raised) > parseInt(t.goal)) ? '100%' : raisedPercentage + "%";
                    $('#bar_progress').css('width', counterWidth);

                    // Activate Donation Modal:
                    setTimeout(function() {
                        if ($.colorbox) {
                            $('#joinTeamButton a').colorbox({ href: "#givingOverlay", width: "550px", maxWidth: "100%", height: "50%", maxHeight: "700px", inline: true, opacity: 0.75 });
                            $('#teamList .teamDonation dt:contains("General Team Donation")').html('<a id="teamMembersDonation" href="#givingOverlay">General Team Donation</a>');
                            $('.teamDonation #teamMembersDonation').colorbox({ href: "#givingOverlay", width: "550px", maxWidth: "100%", height: "50%", maxHeight: "700px", inline: true, opacity: 0.75 });
                        }
                    }, 10);

                    // Hide Members in Team Members list that have undisclosed written next to their names.
                    $(ppBodyTable).find('table table table table td b:contains("Members:")').closest('table').find('tr:not(:first):not(:eq(1))').each(function() {
                        var txt = $('td:eq(1)', this).text()
                        if (txt.match('Undisclosed')) {
                            var link = $('td:first a', this).attr('href');
                            $('#teamMembersList a[href="' + link + '"]').parent().next().text('');
                        }
                    });

                    // Honor Roll
                    function hideHonorRoll() {
                        $('.honorRollTitle, #honorRollFeed').remove();
                    }

                    // Get honor roll to donor count (FAF.tID or fafJSONteam.tid)
                    if ((typeof t.tid !== 'undefined') && (t.tid !== null) && (t.tid != 0) && (FAF.Options.hideHonorRoll != true) && ($.xml2json)) {
                        $.ajax({
                            type: "GET",
                            cache: false,
                            url: '/gadgets/data/honorroll.aspx?tid=' + t.tid + '&eid=' + FAF.eID,
                            dataType: 'html',
                            success: function(honordata) {
                                var json = $.xml2json(honordata);
                                if ($(json.honoritem).length) {
                                    var html = '';
                                    var num = 0;
                                    $(json.honoritem).each(function(index, honoritem) {
                                        if (honoritem.scrolltypeid == 1) {
											num = num+1;
											html += '<li class="honorItem"><div class="gutter">'
												+ '<span class="honorAmount">$'+honoritem.amount+'</span>'
												+ '<span class="honorNameFrom">'+honoritem.namefrom+'</span><br />'
												+ '<span class="honorNameTo">'+honoritem.nameto+'</span>'
												+ '</div></li>';
										}
										if (honoritem.scrolltypeid == 2) {
											num = num+1;
											html += '<li class="honorItem"><div class="gutter">'
												+ '<span class="honorAmount"></span>'
												+ '<span class="honorNameFrom">'+honoritem.namefrom+'</span><br />'
												+ '<span class="honorNameTo">'+honoritem.nameto+'</span>'
												+ '</div></li>';
										}
                                    });
                                    $('#honorRollFeed .honorRollFeedInner').append('<ul class="honorRollList">' + html + '</ul>');
                                    // Remove non breaking space from honor roll from name
                                    $('#honorRollFeed .honorNameFrom').each(function() {
                                        $(this).html($(this).html().replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' '));
                                    });
                                    if (num > 4) {
                                        $('#honorRollFeed').after('<div id="honorRollControls"><a href="#" id="ticker-previous">Previous</a> / <a href="#" id="ticker-next">Next</a> / <a id="ticker-stop" href="#">Stop</a> / <a id="ticker-start" href="#">Start</a></div>');
                                        $('#honorRollFeed .honorRollFeedInner').totemticker({
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
                                    // hide if there are no donations, hide honorRoll and totalDonors
                                    else if (num <= 0) {
                                        hideHonorRoll()
                                    }
                                } else {
                                    hideHonorRoll()
                                }
                            },
                            error: function(xhr, textStatus, errorThrown) {
                                hideHonorRoll()
                            }
                        });
                    } else { hideHonorRoll() }
                }
            });
        },

        therm: function(amount) {
            setTimeout(function() {

                var o = fafJSONoptions,
					e = FAF.Data.event;

                var thermAmount = (amount == null) ? parseInt(e.raised) : parseInt(amount);

                var outerDiv = $('.thermometer'),
					counterDiv = $('#devmeter'),
					counterVal = $('.fundbarThermometer .thermRaisedValue, .fundbarRaised .fundValue'),
					starttime = new Date(),
					now,
					timespan,
					curNum = 0,
					divWidth,
					start = thermAmount / 10,
					end = thermAmount,
					rate = thermAmount / 60,
					delay = 1,
					counter = $('#devmeter'),
					max = $('.thermometer').width(),
					goal = ((o.thermometer.customGoal != "" && o.thermometer.customGoal != null) || e.goal == "" || e.goal == null) ? parseInt(o.thermometer.customGoal) : parseInt(e.goal);
                	goal = (parseInt(thermAmount) > parseInt(goal)) ? thermAmount : goal;
                var ppx = (goal != 0) ? max / goal : max / thermAmount,
					m = FAF.Methods;

                var update = function() {
                    now = new Date();
                    timespan = (now.valueOf() - starttime.valueOf()) / 50;
                    curNum = Math.round(start + (timespan * rate));
                    divWidth = curNum * ppx;
                    if (curNum >= end) {
                        divWidth = (thermAmount * ppx >= max) ? max : thermAmount * ppx;
                        var percent = divWidth / max * 100;
                        counterDiv.width(percent + "%");
                        counterVal.text(m.formatCurrencyWSymbol(end));
                        return;
                    } else {
                        counterVal.text(m.formatCurrencyWSymbol(curNum));
                        // Only animate if divWidth is greater than FAF.Options.therm.minWidth 
                        // or less than the therm's width (max)
                        var percent = divWidth / max * 100;
                        if ((divWidth >= FAF.Options.therm.minWidth && divWidth <= max)) {
                            counterDiv.width(percent + "%");
                        } else if (divWidth > max) {
                            counterDiv.width("100%");
                        }
                        setTimeout(update, delay);
                    }
                };
                if (counterDiv != null) {
                    var startWidth = (FAF.Options.therm.minWidth != 0 && FAF.Options.therm.minWidth != null) ? FAF.Options.therm.minWidth + "px" : "0px";
                    counterDiv.width(startWidth);
                    update();
                }
            }, 3000);

        },

        formatCurrencyWSymbol: function(num, symbol) {
            symbol = symbol || FAF.Options.currency;
            num = num.toString().replace(/\$|\,/g, '');
            if (isNaN(num)) num = "0";
            sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            cents = num % 100;
            num = Math.floor(num / 100).toString();
            if (cents < 10) cents = "0" + cents;
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
            return (((sign) ? '' : '-') + symbol + num);
        },

        dynamicLinks: function() {
            $(document).ready(function() {
                // Dynamic Links - Just add the class specified below to any <a> link
                $('.faf-home').attr('href', FAF.root + '/faf/home/default.asp?ievent=' + FAF.eID); 					// home link
                $('.faf-aboutorg').attr('href', FAF.root + '/faf/help/helpAboutOrg.asp?ievent=' + FAF.eID); 			// about us page
                $('.faf-eventinfo').attr('href', FAF.root + '/faf/help/helpEventInfo.asp?ievent=' + FAF.eID); 		// event information page
                $('.faf-sponsors').attr('href', FAF.root + '/faf/SponsorASP/ViewSponsors.asp?ievent=' + FAF.eID); 	// view sponsors page
                $('.faf-faq').attr('href', FAF.root + '/faf/help/helpFaq.asp?ievent=' + FAF.eID); 					// faq page
                $('.faf-register').attr('href', FAF.root + '/faf/home/waiver.asp?ievent=' + FAF.eID); 				// participant registration page
                $('.faf-search').attr('href', FAF.root + '/faf/search/searchParticipants.asp?ievent=' + FAF.eID); 	// sponsor participant search
                $('.faf-emailfriend').attr('href', FAF.root + '/faf/email/emailFriend.asp?ievent=' + FAF.eID); 		// spread the word page
                $('.faf-donation').attr('href', FAF.root + '/faf/donorReg/donorPledge.asp?supId=0&ievent=' + FAF.eID); // general donation page
                $('.faf-sponsorship').attr('href', FAF.root + '/faf/sponsorasp/catalog.asp?ievent=' + FAF.eID); 		// sponsorship opportunities
                $('.faf-login').attr('href', FAF.root + '/faf/login/loginParticipant.asp?ievent=' + FAF.eID); 		// participant login						
                $('.faf-forgotusername').attr('href', FAF.root + '/faf/login/loginFindPassword.asp?ievent=' + FAF.eID); // forgot username
                $('#FAFLoginFormHeader').attr('action', '/faf/login/checkPartLogin.asp?ievent=' + FAF.eID);
                $('.faf-teamSearch').attr('href', FAF.root + '/faf/search/searchTeam.asp?ievent=' + FAF.eID); 		// team search page
                $('.faf-volunteer').attr('href', FAF.root + '/faf/volunteerRegNew/default.asp?ievent=' + FAF.eID); 	// volunteer opportunities

                // FOR LOGGED IN USERS ONLY:
                if (FAF.isLoggedIn === true) {
                    $('.faf-myhq').attr('href', FAF.root + '/faf/login/partMenu.asp?ievent=' + FAF.eID); 						// enter hq
                    $('.faf-email').attr('href', FAF.root + '/faf/emailCenter/email.asp?login=lmenu&ievent=' + FAF.eID); 		// email friends
                    $('.faf-edit').attr('href', FAF.root + '/faf/login/page_edit.asp?login=lmenu&ievent=' + FAF.eID); 		// edit my site
                    $('.faf-reports').attr('href', FAF.root + '/faf/login/participantStats.asp?login=lmenu&ievent=' + FAF.eID); // reports
                    $('.faf-tools').attr('href', FAF.root + '/faf/partDonorReg/pledgeEntry.asp?login=lmenu&ievent=' + FAF.eID); // tools
                }
                // FOR LOGGED OUT USERS ONLY:
                else {
                    $('.faf-myhq').attr('href', FAF.root + 'href="javascript:redirectLoginMenu(\'hq\')'); 		// enter hq
                    $('.faf-email').attr('href', FAF.root + 'href="javascript:redirectLoginMenu(\'email\')'); 	// email friends
                    $('.faf-edit').attr('href', FAF.root + 'href="javascript:redirectLoginMenu(\'personal\')'); // edit my site
                    $('.faf-reports').attr('href', FAF.root + 'href="javascript:redirectLoginMenu(\'reports\')'); // reports
                    $('.faf-tools').attr('href', FAF.root + 'href="javascript:redirectLoginMenu(\'tools\')'); 	// use tools
                }
            });
        },

        facebook: function() {
            $(document).ready(function() {
                if (typeof fafJSONoptions.facebook != "undefined") {

                    var f = fafJSONoptions.facebook;

                    if (f.hideAll == "false") {

						// create a URL Facebook can archive, strip the session variables...
						var url = '';
						var firstPart = location.href.split('/faf')[0];
						if (location.href.indexOf('/faf/donorReg/donorPledge.asp')>-1) { // personal page
							url = encodeURIComponent(firstPart + '/faf/donorReg/donorPledge.asp?ievent=' + FAF.eID + '&supId=' + FAF.sID);
						} else if (location.href.indexOf('/faf/search/searchTeamPart.asp')>-1) { // team page
							url = encodeURIComponent(firstPart + '/faf/search/searchTeamPart.asp?ievent=' + FAF.eID + '&team=' + FAF.tID);
						} else {
							url = encodeURIComponent(location.href);
						}

                        // Team page title:
                        if (typeof fafJSONteam != 'undefined') {
                            var title = 'Leave an encouraging note for';
                            var name = fafJSONteam.name;
                            title = (f.commentsTitle != "" && typeof f.commentsTitle != "undefined") ? f.commentsTitle : title + ' <span id="fundraiser">' + name + '</span>';
                            $('#facebookComments').append('<h5>' + title + '</h5><div class="fb-comments" data-href="' + url + '" data-num-posts="2" data-width="470"></div>');
                        }

                        // Personal page title:
                        if (typeof fafJSONparticipant != 'undefined') {
                            var title = 'Leave an encouraging note for';
                            var name = fafJSONparticipant.name;
                            title = (f.commentsTitle != "" && typeof f.commentsTitle != "undefined") ? f.commentsTitle : title + ' <span id="fundraiser">' + name + '</span>';
                            $('#facebookComments').append('<h5>' + title + '</h5><div class="fb-comments" data-href="' + url + '" data-num-posts="2" data-width="470"></div>');
                        }

                        // Load Facebook like button and comments
                        if (f.hideLikeBox == "true") {
                            $('.fb-like').hide();
                        }
                        if (f.hideComments == "true") {
                            $('#facebookComments').hide();
                        }

                        // Home Page
                        if (location.href.indexOf('faf/home/default.asp') > -1 && f.hideNewsFeed == "false") {
                            var facebookTitle = (typeof f.feedTitle != "undefined" && f.feedTitle != "") ? f.feedTitle : FAF.Options.facebook.feedTitle;
                            facebookTitle = (typeof f.link != "undefined" && f.link != "") ? '<a href="' + f.link + '">' + facebookTitle + '</a>' : facebookTitle;
                            var appID = (typeof f.appId != "undefined" && f.appId != "") ? f.appId : FAF.Options.facebook.appId;
                            var feedHtml = '<div id="facebookFeed"><h5>' + facebookTitle + '</h5><div class="fb-live-stream" data-event-app-id="' + appID + '" data-width="450" data-height="250" data-always-post-to-friends="true"></div></div>';
                            $('#contentPrimary .gutter').append(feedHtml);
                        }
                    }
                }
            });
        },

        shareThis: function() {
            $(document).ready(function() {
                if (typeof fafJSONoptions.sharePage != "undefined") {
                    if (fafJSONoptions.sharePage.hideAll == "false") {

                        var s = fafJSONoptions.sharePage;
                        if (s.appId == "" || typeof s.appId == "undefined") {
                            s.appId = FAF.Options.sharePage.appId;
                        }

                        var title = (s.title == "" || typeof s.title == "undefined") ? FAF.Options.sharePage.title : s.title;
                        var servicesHtml = "";
                        var services = (s.services != "" && typeof s.services != "undefined") ? s.services.split(',') : FAF.Options.sharePage.services.split(',');
                        $.each(services, function(i, service) {
                            // facebook, twitter, email, sharethis
                            servicesHtml += '<span class="st_' + $.trim(service) + '_large"></span>';
                        });
                        servicesHtml += '<span class="st_sharethis_large"></span>';

                        // Run ShareThis.com scripts (except on donation billing pages)
                        if ((FAF.thisURL.indexOf("donorreg/donorbilling.asp") === -1) && (FAF.thisURL.indexOf("donorreg/donorrecognition.asp") === -1) && (FAF.thisURL.indexOf("donorreg/donorconfirmation.asp") === -1) && (FAF.thisURL.indexOf("registerteam.asp") === -1) && (FAF.thisURL.indexOf("register.asp") === -1) && (FAF.thisURL.indexOf('faf/login/') == -1) && FAF.thisURL.indexOf('faf/r/review.asp?') == -1 && FAF.thisURL.indexOf('faf/r/confirmation.asp') == -1 && FAF.thisURL.indexOf('faf/volunteerregnew/volunteerselection.asp') == -1) {
                            $('head').append('<scr' + 'ipt type="text/javascript">var switchTo5x=true</scr' + 'ipt>');
                            $('head').append('<scr' + 'ipt type="text/javascript" src="https://ws.sharethis.com/button/buttons.js"></scr' + 'ipt>');
                            if (typeof stLight !== 'undefined') {
                                $('head').append('<scr' + 'ipt type="text/javascript">stLight.options({publisher: "' + s.appId + '"});</scr' + 'ipt>');
                            } else {
                                setTimeout(function() {
                                    if (typeof stLight !== 'undefined') {
                                        $('head').append('<scr' + 'ipt type="text/javascript">stLight.options({publisher: "' + s.appId + '"});</scr' + 'ipt>');
                                    } else {
                                        setTimeout(function() {
                                            $('head').append('<scr' + 'ipt type="text/javascript">stLight.options({publisher: "' + s.appId + '"});</scr' + 'ipt>');
                                        }, 2000);
                                    }
                                }, 2000);
                            }
                            // Default ShareThis HTML (if none specified):
                            if (!$('#shareThisIcons').length) {
                                var shareThisHtml = '<div id="shareThis"><h6 class="sidebarTitle shareThisTitle">' + title + '</h6><div id="shareThisIcons" class="clearfix">' + servicesHtml + '</div></div>';
                                if (FAF.thisURL.indexOf('donorpledge.asp') > -1) {
                                    $('#contentTertiary .gutter').append(shareThisHtml);
                                } else {
                                    $(shareThisHtml).insertAfter($('#contentTertiary div[align="right"]'));
                                }
                            }
                        }
                        // Add logo as Open Graph meta image (except if it already exists - personal/team pages)
                        if (!$('meta[property="og:image"]').length) {
                            if ($('#header #logo img').length > 0) {
                                var ogImageSrc = $('#header #logo img').attr('src');
                                if (ogImageSrc.indexOf("http") != -1) {
                                    $('head').append('<meta property="og:image" content="' + ogImageSrc + '"/>')
                                } else {
                                    $('head').append('<meta property="og:image" content="' + FAF.root + '/' + ogImageSrc.replace('..', 'faf') + '"/>')
                                }
                            }
                        }
                    }
                }
            });
        },

        twitter: function() {
            $(document).ready(function() {
                if (typeof fafJSONoptions.twitter != "undefined") {
                    var o = fafJSONoptions.twitter;
                    if (o.hideAll == "false" && typeof o.appId !== 'undefined' && o.appId != null && o.appId != "") {
                        // Show only on the home page:
                        if (location.href.indexOf("home/default.asp") > -1) {
                            var twitterTitleHtml = (typeof o.title != 'undefined' && o.title != null && o.title != "") ? o.title : FAF.Options.twitter.title;
                            var appID = (typeof o.appId != "undefined" && o.appId != "") ? o.appId : FAF.Options.twitter.appId;
                            var twitterLink = (typeof o.link != 'undefined' && o.link != null && o.link != "") ? o.link : 'http://www.twitter.com/' + appID + '';
                            var count = (typeof o.count != "undefined" && o.count != "") ? o.count : FAF.Options.twitter.count;
                            $('#contentTertiary .gutter').append('<div id="rightColumnBottom"><h6 class="twitterFeedTitle sidebarTitle"><a href="' + twitterLink + '">' + twitterTitleHtml + '</a></h6><div id="twitterFeed"></div></div>')
                            $('#twitterFeed').jTweetsAnywhere({ username: o.appId, count: count });
                        }
                    }
                }
            });
        },

        youTube: function() {
            $(document).ready(function() {
                if (typeof fafJSONoptions.youTube != "undefined") {
                    var y = fafJSONoptions.youTube;
                    if (typeof y.embedCode != "undefined" && y.embedCode != "" && location.href.indexOf("home/default.asp") > -1) {
                        var title = (typeof y.title != "undefined" && y.title != "") ? y.title : FAF.Options.youTube.title;
                        title = (typeof y.link != "undefined" && y.link != "") ? '<a href="' + y.link + '">' + title + '</a>' : title;
                        var embedCode = (typeof y.embedCode != "undefined" && y.embedCode != "") ? y.embedCode : '';
                        var youtubeHtml = '<div id="youtubeVideo"><h5>' + title + '</h5>' + embedCode + '</div>';
                        $('#contentPrimary .gutter').append(youtubeHtml);
                    }
                }
            });
        },

        showContent: function() {
            if (FAF.thisURL.indexOf("search/searchteampart.asp") === -1 && location.href.indexOf('/faf/donorReg/donorPledge.asp') === -1) {
                $('.FAFBodyTable').show();
            }
        }
    }
}

FAF.go = function(callback) {
    var m = FAF.Methods;
    m.initialize(function() {
        $(document).ready(function() {
        	m.initMiniLogin();
            m.checkLogin();
            m.cleanup();
            m.rewritePersonalPage();
            m.rewriteTeamPage();
            m.youTube();
            m.facebook();
            m.shareThis();
            m.twitter();
            m.therm();
            m.showContent();
            if (callback) callback();
        });
    });
};
FAF.go();

function testTherm(amount) {
    FAF.Methods.therm(amount);
}