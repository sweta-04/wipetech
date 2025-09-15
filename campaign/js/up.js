
(function(window, document){
    function createHttpRequest()
    {
        if(window.ActiveXObject){
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
        else if(window.XMLHttpRequest){
            return new XMLHttpRequest();
        }
    }
    function AliLogTracker(host,project,logstore)
    {
        this.uri_ = 'https://' + project + '.' + host + '/logstores/' + logstore + '/track?APIVersion=0.6.0';
        this.params_=new Array();
        this.httpRequest_ = createHttpRequest();
    }
    AliLogTracker.prototype = {
        push: function(key,value) {
            if(!key || !value) {
                return;
            }
            this.params_.push(key);
            this.params_.push(value);
        },
        logger: function()
        {
            var url = this.uri_;
            var k = 0;
            while(this.params_.length > 0)
            {
                if(k % 2 == 0)
                {
                    url += '&' + encodeURIComponent(this.params_.shift());
                }
                else
                {
                    url += '=' + encodeURIComponent(this.params_.shift());
                }
                ++k;
            }
            try
            {
                this.httpRequest_.open("GET",url,true);
                this.httpRequest_.send(null);
            }
            catch (ex)
            {
                if (window && window.console && typeof window.console.log === 'function')
                {
                    console.log("Failed to log to ali log service because of this exception:\n" + ex);
                    console.log("Failed log data:", url);
                }
            }

        }
    };
    window.Tracker = AliLogTracker;
})(window, document);

$(function(){
    var logstore_name = 'logstore_web_landing';
    if (globleJs.GET('ProductName') == 'TB'){
        logstore_name = 'logstore_tbp_ip';
    }else if (globleJs.GET('ProductName') == 'DRW'){
        logstore_name = 'logstore_windrw_ip';
    }else if (globleJs.GET('ProductName') == 'EPM'){
        logstore_name = 'logstore_epm_ip';
    }else if (globleJs.GET('ProductName') == 'ECG'){
        logstore_name = 'logstore_ecg_ip';
    }


    var logger = new window.Tracker('us-east-1.log.aliyuncs.com','easeusinfo', logstore_name);

    var logger_set_fun={
        getOS:function() {
            var userAgent = navigator.userAgent.toLowerCase();
            var name = 'Unknown';
            var version = 'Unknown';
            if (userAgent.indexOf('win') > -1) {
                name = 'Windows';
                if (userAgent.indexOf('windows nt 5.0') > -1) {
                    version = 'Windows 2000';
                } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
                    version = 'Windows XP';
                } else if (userAgent.indexOf('windows nt 6.0') > -1) {
                    version = 'Windows Vista';
                } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
                    version = 'Windows 7';
                } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
                    version = 'Windows 8';
                } else if (userAgent.indexOf('windows nt 6.3') > -1) {
                    version = 'Windows 8.1';
                } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
                    version = 'Windows 10';
                } else {
                    version = 'Unknown';
                }
            } else if (userAgent.indexOf('iphone') > -1) {
                name = 'Iphone';
            } else if (userAgent.indexOf('mac') > -1) {
                name = 'Mac';
            } else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
                name = 'Unix';
            } else if (userAgent.indexOf('linux') > -1) {
                if (userAgent.indexOf('android') > -1) {
                    name = 'Android';
                } else {
                    name = 'Linux';
                }
            } else {
                name = 'Unknown';
            }
            this.getOS=function(){
                return { name:name, version:version };
            }
            return { name:name, version:version };
        },
        Browse:function() {
            var browser = {};
            var userAgent = navigator.userAgent.toLowerCase();
            var s;
            (s = userAgent.match(/msie ([\d.]+)/)) ? browser.ie = s[1] : (s = userAgent.match(/firefox\/([\d.]+)/)) ? browser.firefox = s[1] : (s = userAgent.match(/chrome\/([\d.]+)/)) ? browser.chrome = s[1] : (s = userAgent.match(/opera.([\d.]+)/)) ? browser.opera = s[1] : (s = userAgent.match(/version\/([\d.]+).*safari/)) ? browser.safari = s[1] : 0;
            var version = '';
            if (browser.ie) {
                version = 'IE ' + browser.ie;
            }
            else {
                if (browser.firefox) {
                    version = 'firefox ' + browser.firefox;
                }
                else {
                    if (browser.chrome) {
                        version = 'chrome ' + browser.chrome;
                    }
                    else {
                        if (browser.opera) {
                            version = 'opera ' + browser.opera;
                        }
                        else {
                            if (browser.safari) {
                                version = 'safari ' + browser.safari;
                            }
                            else {
                                version = '未知浏览器';
                            }
                        }
                    }
                }
            };
            version=version.split(' ');
            this.Browse=function(){
                return version;
            };
            return version;
        }
    }
	
	
	var source_data = ''
	
	if (document.referrer !== '')
	{
		source_data = document.referrer;
	}else
	{
		source_data = globleJs.GET('ProductVersion') + '-' + globleJs.GET('ProductVersionCode');
	}
	
	
	var landing_page = ''
	
	if (globleJs.GET('ID') !== '')
	{
		landing_page = globleJs.GET('ID') + '_' + document.URL.split("?")[0];
	}else
	{
		landing_page = '0_' + document.URL.split("?")[0];
	}	
	
	
	
	
    var logger_load_data={

        UID:globleJs.GET('UID'),
		Timestamp:parseInt(new Date().getTime()/1000),
        Activity:"LandingPage_Open",    
		Source:source_data,
		Attribute:JSON.stringify({		
			OS:logger_set_fun.getOS().name,
			OSVersion:logger_set_fun.getOS().version,
			ScreenHeight:$(window).height(),
			ScreenWidth:$(window).width(),
			Brower:logger_set_fun.Browse()[0],
			BrowerVersion:logger_set_fun.Browse()[1],
			Country:navigator.language,
			PageName:$('title').text()
		}),
        Window:landing_page
    }
    ///
    for(var x in logger_load_data){
        logger.push(x,logger_load_data[x]);
    }
    logger.logger();
    ////
    $('.logger').click(function(){
		var logger_click_data={

			UID:globleJs.GET('UID'),
			Timestamp:parseInt(new Date().getTime()/1000),
			Activity:'Click_Button',    
			Source:source_data,
			Attribute:JSON.stringify({		
				ButtonName:$(this).data('name')
			}),
			Window:landing_page
		}
				
        for(var x in logger_click_data){
            logger.push(x,logger_click_data[x]);
        }
        logger.logger();
        return true;
    }) 
})