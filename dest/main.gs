function index() {
}
function doPost() {
}
function auth() {
}
function authCallback() {
}/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
var twitter_1 = __webpack_require__(2);
var feed_1 = __webpack_require__(3);
var rss_sheet_1 = __webpack_require__(4);
var request_1 = __webpack_require__(5);
var props = PropertiesService.getScriptProperties();
var twitterKey = props.getProperty('TWITTER_KEY');
var twitterSecret = props.getProperty('TWITTER_SECRET');
var sheetKey = props.getProperty('SHEET_KEY');
var logUrl = props.getProperty('LOG_URL');
global.index = function () {
    Logger.log('start index');
    try {
        if (!twitterKey || !twitterSecret) {
            throw new Error('twitter key or secret is null');
        }
        if (!sheetKey) {
            throw new Error('sheet key is null');
        }
        var twitter_2 = twitter_1.TwitterService.getService(twitterKey, twitterSecret);
        Logger.log('get sheets');
        var sheets = SpreadsheetApp.openById(sheetKey).getSheets();
        Logger.log('get new feeds');
        var feedsList = sheets.map(function (sheet) { return feed_1.Feed.getNewFeeds(sheet); });
        feedsList.forEach(function (feeds) {
            return feeds.forEach(function (feed) {
                try {
                    Logger.log(feed);
                    twitter_1.TwitterService.postUpdateStatus(twitter_2, feed.toShortString());
                }
                catch (e) {
                    Logger.log(e);
                }
            });
        });
    }
    catch (e) {
        Logger.log(e);
    }
    if (logUrl) {
        request_1.sendHttpPost(logUrl, Logger.getLog());
    }
};
global.doPost = function (e) {
    try {
        if (!sheetKey) {
            throw new Error('sheet key is null');
        }
        var params = e.parameter;
        var _a = params.text.split(' '), feedUrl = _a[0], title = _a[1];
        var ss = SpreadsheetApp.openById(sheetKey);
        rss_sheet_1.RssSheetService.insert(ss, feedUrl, title);
        var response = { text: params + " completed" };
        if (logUrl) {
            request_1.sendHttpPost(logUrl, Logger.getLog());
        }
        return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
    catch (e) {
        if (logUrl) {
            request_1.sendHttpPost(logUrl, Logger.getLog());
        }
        return ContentService.createTextOutput(JSON.stringify(e)).setMimeType(ContentService.MimeType.JSON);
    }
};
global.auth = function () {
    Logger.log('auth');
    if (!twitterKey || !twitterSecret) {
        throw new Error('twitter key or secret is null');
    }
    var twitter = twitter_1.TwitterService.getService(twitterKey, twitterSecret);
    twitter_1.TwitterService.authorize(twitter);
    if (logUrl) {
        request_1.sendHttpPost(logUrl, Logger.getLog());
    }
};
// tslint:disable-next-line
global.authCallback = function (request) {
    Logger.log('auth callback');
    if (!twitterKey || !twitterSecret) {
        throw new Error('twitter key or secret is null');
    }
    var twitter = twitter_1.TwitterService.getService(twitterKey, twitterSecret);
    twitter_1.TwitterService.authCallback(twitter, request);
    if (logUrl) {
        request_1.sendHttpPost(logUrl, Logger.getLog());
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUEyQztBQUMzQywrQkFBOEI7QUFDOUIseUNBQThDO0FBQzlDLHFDQUF5QztBQUV6QyxJQUFNLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQ3RELElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDcEQsSUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzFELElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDaEQsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUk1QyxNQUFNLENBQUMsS0FBSyxHQUFHO0lBQ2IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMxQixJQUFJO1FBQ0YsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7U0FDbEQ7UUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsSUFBTSxTQUFPLEdBQUcsd0JBQWMsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDekIsSUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM3RCxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzVCLElBQU0sU0FBUyxH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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TwitterService = /** @class */ (function () {
    function TwitterService() {
    }
    TwitterService.getService = function (key, secret) {
        return (OAuth1.createService('Twitter')
            // Set the endpoint URLs.
            .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
            .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
            .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
            // Set the consumer key and secret.
            .setConsumerKey(key)
            .setConsumerSecret(secret)
            // Set the name of the callback function in the script referenced
            // above that should be invoked to complete the OAuth flow.
            .setCallbackFunction('authCallback')
            // Set the property store where authorized tokens should be persisted.
            .setPropertyStore(PropertiesService.getUserProperties()));
    };
    // 認証
    TwitterService.authorize = function (twitter) {
        Logger.log('authorize');
        var authorizationUrl = twitter.authorize();
        Logger.log('認証URLは下記です。\n%s', authorizationUrl);
    };
    TwitterService.postUpdateStatus = function (twitter, content) {
        Logger.log('post update status');
        if (twitter.hasAccess()) {
            var url = 'https://api.twitter.com/1.1/statuses/update.json';
            var payload = {
                status: content
            };
            var response = twitter.fetch(url, { payload: payload, method: 'post' });
            var result = JSON.parse(response.getContentText());
        }
    };
    // 認証解除
    TwitterService.reset = function (twitter) {
        twitter.reset();
    };
    // 認証後のコールバック
    TwitterService.authCallback = function (twitter, request) {
        var authorized = twitter.handleCallback(request);
        if (authorized) {
            return HtmlService.createHtmlOutput('Success!');
        }
        return HtmlService.createHtmlOutput('Denied');
    };
    return TwitterService;
}());
exports.TwitterService = TwitterService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHdpdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90d2l0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7SUFBQTtJQXNEQSxDQUFDO0lBckRRLHlCQUFVLEdBQWpCLFVBQWtCLEdBQVcsRUFBRSxNQUFjO1FBQzNDLE9BQU8sQ0FDTCxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztZQUM3Qix5QkFBeUI7YUFDeEIsaUJBQWlCLENBQUMsNENBQTRDLENBQUM7YUFDL0Qsa0JBQWtCLENBQUMsNkNBQTZDLENBQUM7YUFDakUsbUJBQW1CLENBQUMseUNBQXlDLENBQUM7WUFFL0QsbUNBQW1DO2FBQ2xDLGNBQWMsQ0FBQyxHQUFHLENBQUM7YUFDbkIsaUJBQWlCLENBQUMsTUFBTSxDQUFDO1lBRTFCLGlFQUFpRTtZQUNqRSwyREFBMkQ7YUFDMUQsbUJBQW1CLENBQUMsY0FBYyxDQUFDO1lBRXBDLHNFQUFzRTthQUNyRSxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQzNELENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSztJQUNFLHdCQUFTLEdBQWhCLFVBQWlCLE9BQVk7UUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN4QixJQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM3QyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVNLCtCQUFnQixHQUF2QixVQUF3QixPQUFZLEVBQUUsT0FBZTtRQUNuRCxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDakMsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDdkIsSUFBTSxHQUFHLEdBQUcsa0RBQWtELENBQUM7WUFDL0QsSUFBTSxPQUFPLEdBQUc7Z0JBQ2QsTUFBTSxFQUFFLE9BQU87YUFDaEIsQ0FBQztZQUNGLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxTQUFBLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDakUsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztTQUN0RDtJQUNILENBQUM7SUFFRCxPQUFPO0lBQ0Esb0JBQUssR0FBWixVQUFhLE9BQVk7UUFDdkIsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxhQUFhO0lBQ04sMkJBQVksR0FBbkIsVUFBb0IsT0FBWSxFQUFFLE9BQVk7UUFDNUMsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxJQUFJLFVBQVUsRUFBRTtZQUNkLE9BQU8sV0FBVyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsT0FBTyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQXRERCxJQXNEQztBQXREWSx3Q0FBYyJ9

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Feed = /** @class */ (function () {
    function Feed(title, url, date) {
        this.title = title;
        this.url = url;
        this.date = date;
    }
    Feed.buildFromCells = function (row) {
        Logger.log('build from cells');
        return new Feed(row[0].toString(), row[1].toString(), new Date(row[2].toString()));
    };
    Feed.prototype.toShortString = function () {
        Logger.log('to short string');
        return this.title + "\r\n" + this.url;
    };
    // フィードの新着チェックを行い、新着があれば配列newFeedsに追加する
    Feed.getNewFeeds = function (sheet) {
        Logger.log('get new feeds');
        var _a = Feed.getFeedList(sheet), feedList = _a.feedList, lastCheckTime = _a.lastCheckTime;
        return feedList.filter(function (feed) {
            return Feed.isNew(feed.date, lastCheckTime);
        });
    };
    // 最新のフィードを取得する
    Feed.getFeedList = function (sheet) {
        Logger.log('get feed list');
        var values = sheet.getRange(1, 1, 1, 3).getValues();
        var _a = values[0], url = _a[0], __ = _a[1], lastCheckTimeObj = _a[2];
        var date = new Date(lastCheckTimeObj.toString());
        var lastCheckTime = date.toString() === 'Invalid Date' ? new Date(0) : date;
        var currentTime = new Date();
        sheet.getRange('C1').setValue(currentTime);
        var lastRow = sheet.getLastRow();
        var feedList = sheet
            .getRange(2, 1, lastRow - 1, 3)
            .getValues()
            .map(function (row) { return Feed.buildFromCells(row); }); // 一括で範囲内全てを取得する
        return { feedList: feedList, lastCheckTime: lastCheckTime };
    };
    // 前回のチェック以降の投稿か確認
    Feed.isNew = function (date, lastCheckTime) {
        Logger.log('is new');
        var postTime = new Date(date.toString());
        return postTime.getTime() > lastCheckTime.getTime();
    };
    return Feed;
}());
exports.Feed = Feed;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mZWVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7SUFDRSxjQUFtQixLQUFhLEVBQVMsR0FBVyxFQUFTLElBQVU7UUFBcEQsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFTLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFNO0lBQUcsQ0FBQztJQUNwRSxtQkFBYyxHQUFyQixVQUFzQixHQUFhO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMvQixPQUFPLElBQUksSUFBSSxDQUNiLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFDakIsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUNqQixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FDNUIsQ0FBQztJQUNKLENBQUM7SUFDRCw0QkFBYSxHQUFiO1FBQ0UsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzlCLE9BQVUsSUFBSSxDQUFDLEtBQUssWUFBTyxJQUFJLENBQUMsR0FBSyxDQUFDO0lBQ3hDLENBQUM7SUFFRCx1Q0FBdUM7SUFDaEMsZ0JBQVcsR0FBbEIsVUFBbUIsS0FBeUM7UUFDMUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN0QixJQUFBLDRCQUFxRCxFQUFuRCxzQkFBUSxFQUFFLGdDQUF5QyxDQUFDO1FBQzVELE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUk7WUFDekIsT0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBcUIsQ0FBQztRQUE1QyxDQUE0QyxDQUM3QyxDQUFDO0lBQ0osQ0FBQztJQUVELGVBQWU7SUFDUixnQkFBVyxHQUFsQixVQUNFLEtBQXlDO1FBRXpDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDNUIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoRCxJQUFBLGNBQXVDLEVBQXRDLFdBQUcsRUFBRSxVQUFFLEVBQUUsd0JBQTZCLENBQUM7UUFDOUMsSUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNuRCxJQUFNLGFBQWEsR0FDakIsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUMxRCxJQUFNLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQy9CLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzNDLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNuQyxJQUFNLFFBQVEsR0FBRyxLQUFLO2FBQ25CLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQzlCLFNBQVMsRUFBRTthQUNYLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQyxDQUFDLGdCQUFnQjtRQUN6RCxPQUFPLEVBQUUsUUFBUSxVQUFBLEVBQUUsYUFBYSxlQUFBLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQsa0JBQWtCO0lBQ1gsVUFBSyxHQUFaLFVBQWEsSUFBWSxFQUFFLGFBQW1CO1FBQzVDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckIsSUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDM0MsT0FBTyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3RELENBQUM7SUFDSCxXQUFDO0FBQUQsQ0FBQyxBQWxERCxJQWtEQztBQWxEWSxvQkFBSSJ9

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RssSheetService = /** @class */ (function () {
    function RssSheetService() {
    }
    RssSheetService.insert = function (ss, feedUrl, title) {
        var sheet = ss.insertSheet(title);
        var a1 = feedUrl;
        var b1 = '=A1&"?d="&C1';
        var a2 = '=importfeed(B1, "items", false, 20)';
        sheet.getRange(1, 1, 1, 2).setValues([[a1, b1]]);
        sheet.getRange(2, 1, 1, 1).setValues([[a2]]);
    };
    return RssSheetService;
}());
exports.RssSheetService = RssSheetService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnNzLXNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Jzcy1zaGVldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0lBQUE7SUFhQSxDQUFDO0lBWlEsc0JBQU0sR0FBYixVQUNFLEVBQTRDLEVBQzVDLE9BQWUsRUFDZixLQUFhO1FBRWIsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDbkIsSUFBTSxFQUFFLEdBQUcsY0FBYyxDQUFDO1FBQzFCLElBQU0sRUFBRSxHQUFHLHFDQUFxQyxDQUFDO1FBQ2pELEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQWJELElBYUM7QUFiWSwwQ0FBZSJ9

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function sendHttpPost(url, message) {
    var payload = {
        text: message || '_'
    };
    var method = 'post';
    var options = {
        method: method,
        payload: JSON.stringify(payload)
    };
    UrlFetchApp.fetch(url, options);
}
exports.sendHttpPost = sendHttpPost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBZ0IsWUFBWSxDQUFDLEdBQVcsRUFBRSxPQUFlO0lBQ3ZELElBQU0sT0FBTyxHQUFHO1FBQ2QsSUFBSSxFQUFFLE9BQU8sSUFBSSxHQUFHO0tBQ3JCLENBQUM7SUFDRixJQUFNLE1BQU0sR0FBVyxNQUFNLENBQUM7SUFDOUIsSUFBTSxPQUFPLEdBQUc7UUFDZCxNQUFNLFFBQUE7UUFDTixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7S0FDakMsQ0FBQztJQUNGLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFWRCxvQ0FVQyJ9

/***/ })
/******/ ]);