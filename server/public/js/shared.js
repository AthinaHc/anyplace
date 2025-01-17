/*
 * AnyPlace: A free and open Indoor Navigation Service with superb accuracy!
 *
 * Anyplace is a first-of-a-kind indoor information service offering GPS-less
 * localization, navigation and search inside buildings using ordinary smartphones.
 *
 * Author(s): Paschalis Mpeis
 *
 * Supervisor: Demetrios Zeinalipour-Yazti
 *
 * URL: http://anyplace.cs.ucy.ac.cy
 * Contact: anyplace@cs.ucy.ac.cy
 *
 * Copyright (c) 2015, Data Management Systems Lab (DMSL), University of Cyprus.
 * All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the “Software”), to deal in the
 * Software without restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * --------------------------------------------------------------------------------
 *
 * Shared javascript resources among different services:
 *  - anyplace_architect
 *  - anyplace_viewer
 *  - anyplace_viewer_campus
 *
 */


// Error messages
ERR_FETCH_BUILDINGS="Something went wrong while fetching buildings.";
ERR_FETCH_ALL_FLOORS="Something went wrong while fetching all floors.";
ERR_USER_AUTH="Could not authorize user. Please refresh.";
ERR_FETCH_FINGERPRINTS="Something went wrong while fetching fingerPrints.";
// TODO Permission denined
ERR_GEOLOC_DEVICE_SETTINGS="Please check your device's geolocation settings.";
ERR_GEOLOC_NET_OR_SATELLITES="Position unavailable. The network is down or the positioning satellites couldn't be contacted.";
ERR_GEOLOC_TIMEOUT="Timeout. The request for retrieving your Geolocation was timed out.";
ERR_GEOLOC_UNKNOWN="There was an error while retrieving your Geolocation. Please try again.";
ERR_GEOLOC_NOT_SUPPORTED="The Geolocation feature is not supported by this browser.";

WARN_NO_FINGERPRINTS="This floor seems not to be FingerPrint mapped. Download the Anyplace app from the Google Play store to map the floor.";
WARN_ACCES_ERROR="Something went wrong while building ACCES map.";

// Activate tooltips
$('document').ready(function(){
    // Hide tooltip on click
    // $('body').tooltip({
    //     selector: '[data-toggle="tooltip"]'
    // }).click(function () {
    //     $('[data-toggle="tooltip"]').tooltip("hide");
    // });

    // modal focus fix
    $('#myModal_Welcome').on('shown.bs.modal', function () {
        $('#myModal_Welcome').trigger('focus')
    });
});

function __addAlert(scope, level, msg) {
  // INFO new lines are not displayed.
  // See more here: https://stackoverflow.com/a/14963641/776345
  // msg = msg.replace(/(?:\r\n|\r|\n)/g, '\n');
  scope.anyService.addAlert(level, msg);
};

function _err(scope, msg) {
  __addAlert(scope, 'danger', msg);
};

var _suc = function (scope, msg) {
  __addAlert(scope, 'success', msg);
};

var _warn = function (scope, msg) {
  __addAlert('warning', msg);
};

var _warn_autohide = function (scope, msg) {
  __addAlert(scope, 'warning', msg)
  window.setTimeout(function() {
    $(".alert-warning").fadeTo(500, 0).slideUp(500, function(){
      $(this).remove();
    });
  }, 5000);
};

var _info = function (scope, msg) {
  __addAlert('info', msg);
  window.setTimeout(function() {
    $(".alert-info").fadeTo(500, 0).slideUp(500, function(){
      $(this).remove();
    });
  }, 10000);
};

function _ShowAlert(scope, func, response, defaultMsg, showDefaultMessage) {
  var data = response.data;
  var msg = defaultMsg;
  if (data != null && data["message"] != null) {
    if(showDefaultMessage) {
      msg += ": " + data["message"];
    } else {
      msg = data["message"];
    }
  }
  func(scope, msg);
}

/**
 * Show Error message from server's response.
 *
 * @param scope
 * @param response
 * @param defaultMsg
 * @param showDefaultMessage
 */
function ShowError(scope, response, defaultMsg, showDefaultMessage) {
  showDefaultMessage = showDefaultMessage || false;
  _ShowAlert(scope, _err, response, defaultMsg, showDefaultMessage)
}

/**
 *  Show Warning message from server's response that autohides.
 * @param scope
 * @param response
 * @param defaultMsg
 * @param showDefaultMessage
 * @constructor
 */
function ShowWarningAutohide(scope, response, defaultMsg, showDefaultMessage) {
  showDefaultMessage = showDefaultMessage || false;
  _ShowAlert(scope, _warn_autohide, response, defaultMsg, showDefaultMessage)
}

function HandleGeolocationError(errorCode) {
  if (err.code == 1) {
    _err($scope, ERR_GEOLOC_DEVICE_SETTINGS)
  } else if (err.code == 2) {
    _err($scope, ERR_GEOLOC_NET_OR_SATELLITES)
  } else if (err.code == 3) {
    _err($scope, ERR_GEOLOC_TIMEOUT)
  } else {
    _err($scope, ERR_GEOLOC_UNKNOWN);
  }
}

function selectAllInputText(element) {
  console.log("Runned!");
  element.setSelectionRange(0, element.value.length)
}



var IMG_ACCESS_POINT_ARCHITECT = 'build/images/wireless-router-icon-bg.png';
var IMG_BUILDING_ARCHITECT = 'build/images/building-icon.png';
// PM: For some reason different dimensions are used for viewer
var IMG_BUILDING_VIEWER = 'build/images/building-icon-viewer.png';
var IMG_FINGERPRINT_RED_SPOT= 'build/images/red_dot.png';


function getMapsIconBuildingViewer(scope, latLong) {
    // console.log("getMapsIconBuildingViewer")
    var s = new google.maps.Size(55, 80);
    if (scope.isFirefox)
        s = new google.maps.Size(110, 160);

    return new google.maps.Marker({
        position: latLong,
        icon: {
            url: IMG_BUILDING_VIEWER,
            size: s,
            scaledSize: new google.maps.Size(55, 80)
        },
        draggable: false
    });
}

function getMapsIconBuildingArchitect(gmap, latLong) {
    return new google.maps.Marker({
        position: latLong,
        map: gmap,
        icon: new google.maps.MarkerImage(
            IMG_BUILDING_ARCHITECT,
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            new google.maps.Size(54, 54)),
        draggable: false
    });
}

function getMapsIconFingerprint(gmaps, fingerPrintsData) {
    var size = new google.maps.Size(25, 25);
    return new google.maps.Marker({
        position: fingerPrintsData.location,
        map: gmaps,
        icon: new google.maps.MarkerImage(
            IMG_FINGERPRINT_RED_SPOT,
            null, /* size is determined at runtime */
            null, /* origin is 0,0 */
            null, /* anchor is bottom center of the scaled image */
            size
        )
    });
}

