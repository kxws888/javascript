(function ($) {
    'use strict';
    var document = window.document;
    $.Class('ImagePreloader', {
        init: function (images, callback) {
            this.callback = callback;

            this.nLoaded = 0;
            this.nProcessed = 0;
            this.aImages = new Array;

            this.nImages = images.length;

            // for each image, call preload()
            for (var i = 0; i < images.length; i++) {
                this.preload(images[i]);
            }
        },

        preload: function (image) {
            var oImage = new Image;
            this.aImages.push(oImage);

            oImage.onload = this.onload;
            oImage.onerror = this.onerror;
            oImage.onabort = this.onabort;

            // assign pointer back to this.
            oImage.oImagePreloader = this;
            oImage.bLoaded = false;

            oImage.src = image;
        },
        onComplete: function () {
            this.nProcessed++;
            if (this.nProcessed == this.nImages) {
                this.callback(this.aImages, this.nLoaded);
            }
        },
        onload: function () {
            this.bLoaded = true;
            this.oImagePreloader.nLoaded++;
            this.oImagePreloader.onComplete();
        },
        onerror: function () {
            this.bError = true;
            this.oImagePreloader.onComplete();
        },
        onabort: function () {
            this.bAbort = true;
            this.oImagePreloader.onComplete();
        }
    });

    jQuery.Class('AvatarViewer', {
        init: function (domNode, strPrefix, strAvatarID, objClickEvent, isPNG) {

            if (!strPrefix || ! strAvatarID) {
                return;
            }

            this.strPrefix = strPrefix;
            this.strAvatarID = strAvatarID;

            var avatarIdVersion, isCompositeIMG, urls = [], width, height, self = this;
            avatarIdVersion = this.getAvatarIdVersion(strAvatarID);
            isCompositeIMG = this.checkCompositeServer(strPrefix, avatarIdVersion, isPNG);

            width = AvatarViewer.SIZE_INFO[strPrefix.substring(0, 2)][0];
            height = AvatarViewer.SIZE_INFO[strPrefix.substring(0, 2)][1];

            if (avatarIdVersion === 1) {
                if(isCompositeIMG) {
                    var strHeader = strPrefix.replace(/([C|G|W][F|H])([S|A]*)/, 'A$1$2');
                    urls[0] = AvatarViewer.Path.AVATAR_SERVER_URL + "/IMG_AVTR/" + strHeader + "_" + strAvatarID + ".GIF";
                }
                else {
                    urls = this.getAvatarSrc("A" + strPrefix, strAvatarID);
                }
            }
            else if (avatarIdVersion === 2) {
                if (isCompositeIMG) {
                    var strHeader = strPrefix.replace(/([C|G|W][F|H|B])[S|A]*/, 'P$1');
                    urls[0] = VIEWER_AVATAR_SERVER_URL + "/IMG_AVTR/" + strHeader + "_" + strAvatarID + ".PNG";
                }
                else {
                    var strHeader = strPrefix.replace(/([W|L|M|S][F|H|B])([O|U|Z]*)[S|A]*/, '$1$2');
                    return domNode.html(new AvatarViewerFlash({
                        type: strHeader,
                        id: strAvatarID,
                        host: AvatarViewer.Path.MYPAGE_SERVER_URL
                    }, 'adsdas').html());
                }
            }

            new ImagePreloader(urls, function (images, nLoaded) {
                var avater;
                if (nLoaded > 1) {
                    avater = $('<span>');
                    for (var i = 0, len = images.length, img ; i < len ; i += 1) {
                        img = $('<img>');
                        img.css('position', 'absolute');
                        img.attr('src', images[i].src);
                        avater.append(img);
                    }
                }
                else {
                    avater = $('<img>');
                    avater.attr('src', nLoaded === 0 ? 'unknown.jpg' : images[0].src);
                }
                avater.attr({
                    cursor: 'pointer',
                    width: width,
                    height: height
                }).css({
                    width: width,
                    height: height
                });
                if (typeof objClickEvent !== 'undefined') {
                    avater.bind('click', function () {
                        eval(objClickEvent);
                    });
                }
                domNode.append(avater);
            });

        },

        getAvatarIdVersion: function (strAvatarID) {
            return strAvatarID && strAvatarID.charAt(0) === '2' ? 2 : 1;
        },

        checkCompositeServer: function (sizePrefix, avatarIdVersion, isPNG){
            var sizeCode = sizePrefix[0], aniCode;
            aniCode = (sizePrefix.length >= 3) ? sizePrefix.substring(2, 3) : "A";

            if (avatarIdVersion == '1') {
                return sizeCode == "C" || aniCode == "S";
            } else if(avatarIdVersion == '2'){
                return sizeCode == "C" || sizeCode == "G" || (sizeCode == "W" && isPNG);
            }
        },

        getAvatarSrc: function () {
            var strPropPart, strAvPart, arrProperties, arrImgCodes, strMappedLayerHeader, strSerial, strAvCode, i, j, len, tmp, arrAvFileList = [];

            strPropPart = this.strAvatarID.substring(0, this.strAvatarID.indexOf('-'));
            strAvPart = this.strAvatarID.substring(this.strAvatarID.indexOf('-') + 1);
            arrProperties = this.getProperties(strPropPart);
            strAvPart = this.filter(arrProperties['Set'], strAvPart);
            arrImgCodes = strAvPart.split('_');
            for (i = arrImgCodes.length - 1 ; i >= 0 ; i -= 1) {
                tmp = arrImgCodes[i];
                strMappedLayerHeader = this.getOrgLayerHeader(tmp.charAt(0), arrProperties);
                strSerial = tmp.substring(1);
                if (strSerial === '') {
                    strSerial = '1';
                }
                strAvCode = AvatarViewer.LAYER_INFO[strMappedLayerHeader][2];
                if (AvatarViewer.LAYER_INFO[strMappedLayerHeader][0] > 1 && arrAvFileList[strMappedLayerHeader]) {
                    arrAvFileList[arrAvFileList.length] = arrAvFileList[strMappedLayerHeader].replace(/\d$/, function (match, offset, str) {
                        return parseInt(match, 10) + 1;
                    });
                    continue;
                }

                strAvCode = strAvCode.split('');
                for (j = strAvCode.length - 1 ; j >= 0 ; j -= 1) {
                    if (strAvCode[j] === 'Z') {
                        strAvCode[j] = '1';
                    }
                    else if (strAvCode[j] === 'N') {
                        strAvCode[j] = strSerial;
                    }
                    else if (typeof arrProperties[strAvCode[j]] !== 'undefined') {
                        strAvCode[j] = arrProperties[strAvCode[j]];
                    }
                }
                strAvCode = strMappedLayerHeader + strAvCode.join('');
                arrAvFileList[strMappedLayerHeader] = arrAvFileList[arrAvFileList.length] = strAvCode;
            }
            tmp = [];
            for (i = arrAvFileList.length - 1 ; i >= 0 ; i -= 1) {
                tmp[tmp.length] = AvatarViewer.Path.WEB_PATH + arrAvFileList[i].substring(0, 2).toLowerCase() + '/' + arrAvFileList[i].toLowerCase() + '.gif';
            }
            return tmp;

        },

        filter: function (t, strAvPart) {
            var reg1, reg2;
            switch (t) {
            case 'A':
            case 'D':
            case 'E':
            case 'F':
                reg1 = /_[HNOAM][^_]*?/;
                reg2 = /_[PL]/;
                break;
            case 'B':
                reg1 = /_[^4ECT54L][^_]*?/;
                reg2 = /_L/;
                break;
            }
            return strAvPart.replace(reg1, '').replace(reg2, '_S');
        },

        getProperties: function (strPropPart) {
            var arrProperties = {};

            arrProperties["Version"] = arrProperties["V"] = strPropPart.charAt(0);
            arrProperties["SkinColor"] = arrProperties["C"] = strPropPart.charAt(1);
            arrProperties["Sex"] = arrProperties["S"] = strPropPart.charAt(2);
            arrProperties["Hair"] = arrProperties["H"] = strPropPart.charAt(3);
            arrProperties["Emotion"] = arrProperties["E"] = strPropPart.charAt(4);
            arrProperties["Set"] = arrProperties["T"] = strPropPart.charAt(5);
            arrProperties["Face"] = arrProperties["F"] = strPropPart.charAt(6);
            arrProperties["Reserve"] = arrProperties["R"] = strPropPart.charAt(7);

            return arrProperties;
        },

        getOrgLayerHeader: function (strMappedLayerHeader, arrProperties) {
            var strOrgLayerHeader, strTemp;
            strOrgLayerHeader = AvatarViewer.LAYER_MAPPING[strMappedLayerHeader];
            if(strOrgLayerHeader.charAt(1) === "?") {
                strTemp = strOrgLayerHeader.charAt(0);
                switch(strTemp) {
                    case "P" :
                        strOrgLayerHeader = strTemp + arrProperties["Hair"];
                    break;
                    case "F" :
                        strOrgLayerHeader = strTemp + arrProperties["Face"];
                    break;
                    case "S" :
                        strOrgLayerHeader = strTemp + arrProperties["Set"];
                    break;
                    default :
                        return "";
                }
            }
            return strOrgLayerHeader;
        }
    });

    AvatarViewer.Path = (function () {
        var avatarServerUrl, imagesServerUrl, avaimgServerUrl, mypageServerUrl, webPath, gamePath, hostReg = /test|dev|alpla-/i;

        if (hostReg.test(location.hostname)) {
            avatarServerUrl = "http://alpha-avatar.hangame.co.jp";
            imagesServerUrl = "http://alpha-images.hangame.co.jp";
            avaimgServerUrl = "http://alpha-avaimg.hangame.co.jp";
            mypageServerUrl = "http://alpha-mypage.hangame.co.jp";
        }
        else {
            avatarServerUrl = "http://avatar.hangame.co.jp";
            imagesServerUrl = "http://images.hangame.co.jp";
            avaimgServerUrl = "http://avaimg.hangame.co.jp";
            mypageServerUrl = "http://mypage.hangame.co.jp";
        }

        webPath = avaimgServerUrl + "/_images/itemshop/view/";
        gamePath = avaimgServerUrl + "/_images/itemshop/game/";

        return {
            AVATAR_SERVER_URL: avatarServerUrl,
            IMAGES_SERVER_URL: imagesServerUrl,
            AVAIMG_SERVER_URL: avaimgServerUrl,
            MYPAGE_SERVER_URL: mypageServerUrl,
            WEB_PATH: webPath,
            GAME_PATH: gamePath
        }
    })();

    AvatarViewer.SIZE_INFO = {
        "WF": [66, 150],  // Webフルサイズ
        "WB": [66, 150],  // Webバスアップサイズ
        "WH": [66, 94],   // Webハーフサイズ
        "GF": [45, 102],  // Gameフルサイズ
        "GB": [45, 102],  // Gameバスアップサイズ
        "GH": [45, 64],   // Gameハーフサイズ
        "CF": [22, 51],   // Channelフルサイズ
        "CH": [22, 32],   // Channelハーフサイズ
        "LF": [102, 190], // AvatarId 3.0 Loginフルサイズ
        "MF": [168, 313], // AvatarId 3.0 MyPageフルサイズ
        "SF": [184, 343]  // AvatarId 3.0 Shopフルサイズ
    };

    AvatarViewer.LAYER_MAPPING = {
        "1" : "A1",
        "2" : "A2",
        "3" : "A3",
        "4" : "A4",
        "L" : "LC",
        "H" : "HC",
        "P" : "P?",
        "F" : "F?",
        "S" : "S?",
        "5" : "AA",
        "6" : "AB",
        "7" : "AD",
        "8" : "AE",
        "9" : "AF",
        "0" : "AI",
        "A" : "AJ",
        "B" : "E1",
        "C" : "E2",
        "D" : "E3",
        "E" : "E4",
        "G" : "B1",
        "I" : "B2",
        "J" : "B3",
        "K" : "CT",
        "M" : "LD",
        "N" : "HD",
        "O" : "M1",
        "Q" : "M2",
        "R" : "M3",
        "T" : "BL",
        "U" : "BU",
        "V" : "BD",
        "Y" : ""
    };

    AvatarViewer.LAYER_INFO = {
        // header => array(image count, code expression, file name expression)
        // N: serial, S: sex, C: skin color, H: hair, E: emotion, T: set type, F: face, Y: invisible
        // Z: file number
        "A1" : [1, "N", "N"],
        "A2" : [1, "N", "N"],
        "A3" : [2, "SN", "SNZ"],
        "A4" : [2, "N", "NZ"],
        "LC" : [1, "SN", "SN"],
        "HC" : [1, "SN", "SN"],
        "P1" : [2, "SN", "SNZ"],
        "PN" : [2, "SN", "SNZ"],
        "PA" : [2, "SN", "SNZ"],
        "PB" : [2, "SN", "SNZ"],
        "PC" : [2, "SN", "SNZ"],
        "PD" : [2, "SN", "SNZ"],
        "PE" : [2, "SN", "SNZ"],
        "FN" : [1, "SN", "CESN"],
        "FA" : [1, "SN", "CESN"],
        "FB" : [1, "SN", "CESN"],
        "SA" : [3, "SN", "SNZ"],
        "SB" : [1, "SN", "SN"],
        "SD" : [3, "SN", "CSNZ"],
        "SE" : [3, "SN", "CSNZ"],
        "SF" : [3, "SN", "CSNZ"],
        "AA" : [1, "N", "N"],
        "AB" : [2, "N", "NZ"],
        "AD" : [1, "N", "N"],
        "AE" : [1, "N", "N"],
        "AF" : [1, "N", "N"],
        "AI" : [1, "SN", "SN"],
        "AJ" : [2, "SN", "SNZ"],
        "E1" : [2, "N", "NZ"],
        "E2" : [1, "N", "N"],
        "E3" : [1, "N", "N"],
        "E4" : [1, "N", "N"],
        "B1" : [1, "N", "N"],
        "B2" : [1, "N", "N"],
        "B3" : [2, "SN", "SNZ"],
        "CT" : [2, "SN", "SNZ"],
        "LD" : [1, "SN", "CSN"],
        "HD" : [1, "SN", "CSN"],
        "M1" : [1, "SN", "CESN"],
        "M2" : [1, "SN", "CESN"],
        "M3" : [1, "SN", "CESN"],
        "BL" : [1, "N", "N"],
        "BU" : [1, "SN", "CSN"],
        "BD" : [1, "SN", "CSN"]
    };



    $.Class('AvatarViewerFlash', {
        init: function (val, index) {

            this.vals = $.extend(AvatarViewerFlash.vals, val);
            this.params = AvatarViewerFlash.params;

            var type = this.vals["type"];

            this.width = AvatarViewer.SIZE_INFO[type.substring(0, 2)][0] + AvatarViewerFlash.swfPlusWidth[type];
            this.height = AvatarViewer.SIZE_INFO[type.substring(0, 2)][1] + AvatarViewerFlash.swfPlusHeight[type];

            this.params["flashVars"] = this.serialize(this.vals);
            this.params['allowscriptaccess'] = 'always';
            this.params["data"] = this.params["movie"] = AvatarViewer.Path.AVAIMG_SERVER_URL + "/swf/" + AvatarViewerFlash.swfFileName[AvatarViewerFlash.swfFileType[type]] + "?aya=" + Math.random();
        },

        serialize: function (vals) {
            var val = "";
            var cnt = 0;
            for(var v in vals) {
                if (cnt > 0) {
                    val += "&";
                }
                val += v + "=" + vals[v];
                cnt++;
            }
            return val;
        },

        html: function () {
            var html = '', item;
            html += '<object type="application/x-shockwave-flash" data="' + this.params.data + '" width="' + this.width + '" height="' + this.height + '">';
            for (item in this.params) {
                html += '<param name="' + item + '" value="' + this.params[item] + '">';
            }
            html += '<p>' + this.params.alternative + '</p></object>';
            return html;
        }
    })

    AvatarViewerFlash.swfFileType = {"WF":"V", "WB":"V", "LF":"V", "GB":"V", "GH":"V", "WFS":"V", "LFO":"L", "LFU":"L", "LFZ":"L", "MFO":"L", "MFU":"L", "SFO":"L", "SFU":"L"};
    AvatarViewerFlash.swfPlusWidth = {"WF":0, "WB":0, "LF":0, "GB":0, "GH":0, "WFS":0, "LFO":2, "LFU":2, "LFZ":2, "MFO":2, "MFU":2, "SFO":2, "SFU":2};
    AvatarViewerFlash.swfPlusHeight = {"WF":0, "WB":0, "LF":0, "GB":0, "GH":0, "WFS":0, "LFO":40, "LFU":40, "LFZ":20, "MFO":24, "MFU":24, "SFO":24, "SFU":24};
    AvatarViewerFlash.swfFileName = {"V":"avtViewer.swf", "L":"avtLogViewer.swf"};

    AvatarViewerFlash.params = {
        alternative: 'need flash support'
    };

    AvatarViewerFlash.vals = {
        id:'',
        type:'',
        trans:'false',
        host:''
    }



    var VIEWER_idindex = 10;
    function VIEWER_showAvatarNf2(strPrefix, strAvatarID, objClickEvent, isPNG){
        VIEWER_idindex++;
        document.write('<span id="VIEWER_span' + VIEWER_idindex + '"></span>')
        var avatar = new AvatarViewer($("#VIEWER_span" + VIEWER_idindex), strPrefix, strAvatarID, objClickEvent, isPNG);
    }

    window['VIEWER_showAvatarNf2'] = VIEWER_showAvatarNf2;

})(jQuery)
