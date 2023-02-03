exports.handler = async (event, context, callback) => {
  const request = event.Records[0].cf.request;

  if (
    typeof request === "undefined" ||
    typeof request.origin === "undefined" ||
    typeof request.origin.custom === "undefined" ||
    typeof request.origin.custom.customHeaders === "undefined" ||
    typeof request.origin.custom.customHeaders["x-request-host"] === "undefined" ||
    typeof request.origin.custom.customHeaders["x-request-host"][0] === "undefined" ||
    typeof request.origin.custom.customHeaders["x-request-host"][0].value === "undefined"
  ) {
    callback(null, request);
  }

  var language = request.origin.custom.customHeaders["x-request-host"][0].value.split(".")[0];
  var assets_bucket = "assets-craklabel-production.s3.amazonaws.com";
  var mfe_static = "cdncl.jerkmate.com";
  var video_thumbnail_hostname = "camshub-video-thumbnail-scraper-prod.s3.amazonaws.com";
  var hostname = "cl.slutroulette";
  var streamate_profile_thumb = "m1.nsimg.net";
  var querystring = "";

  //Check if we are in staging and use staging URLs
  if (request.origin.custom.customHeaders["x-request-host"][0].value.includes("staging")) {
    assets_bucket = "assets-craklabel-staging.s3.amazonaws.com";
    mfe_static = "cdncl-staging.jerkmate.com";
    video_thumbnail_hostname = "camshub-video-thumbnail-scraper-staging.s3.amazonaws.com";
  }

  if (request.querystring) {
    querystring = "?"+request.querystring;
  }

  /***********************************
   *      CRAKLABEL SPECIFIC
   ***********************************/

  //For English use slutroulette
  if (language.includes("www")) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+request.origin.custom.customHeaders["x-request-host"][0].value.replace("www.","") + request.uri + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(ui-contents)\/(.*)/.test(request.uri)) {
    const matches = request.uri.match(/^\/(ui-contents)\/(.*)/);
    if (language.includes("slutroulette")) {
      language = "en";
    }
    request.origin = {
      s3: {
        domainName: assets_bucket,
        region: '',
        authMethod: 'none',
        path: '',
        customHeaders: {}
      }
    };
    request.uri = "/ui-contents/"+hostname+"/"+language+"/"+matches[2];
    request.headers['host'] = [{ key: 'host', value: assets_bucket}];
    callback(null, request);
  }
  else if (/^\/(generic-page)\/(.*)/.test(request.uri)) {
    const matches = request.uri.match(/^\/(generic-page)\/(.*)/);
    if (language.includes("slutroulette")) {
      language = "en";
    }
    request.origin = {
      s3: {
        domainName: assets_bucket,
        region: '',
        authMethod: 'none',
        path: '',
        customHeaders: {}
      }
    };
    request.uri = "/page/"+hostname+"/"+language+"/"+matches[2];
    request.headers['host'] = [{ key: 'host', value: assets_bucket}];
    callback(null, request);
  }
  else if (/^\/(mfe)\/(.*)/.test(request.uri)) {
    const matches = request.uri.match(/^\/(mfe)\/(.*)/);

    request.origin.custom.domainName = mfe_static;
    request.origin.custom.path = "";
    request.uri = "/"+matches[2];
    request.headers['host'] = [{ key: 'host', value: mfe_static}];

    callback(null, request);
  }
  else if (/^\/(vid-thumb)\/(.*)/.test(request.uri)) {
    const matches = request.uri.match(/^\/(vid-thumb)\/(.*)/);

    request.origin.custom.domainName = video_thumbnail_hostname;
    request.origin.custom.path = "";
    request.uri = "/jerkmate/"+matches[2];
    request.headers['host'] = [{ key: 'host', value: video_thumbnail_hostname}];

    callback(null, request);
  }
  else if (/^\/(perf-thumb)\/(.*)/.test(request.uri)) {s
    const matches = request.uri.match(/^\/(perf-thumb)\/(.*)/);

    request.origin.custom.domainName = streamate_profile_thumb;
    request.origin.custom.path = "";
    request.uri = "/"+matches[2];
    request.headers['host'] = [{ key: 'host', value: streamate_profile_thumb}];

    callback(null, request);
  }
  else if (/^\/(.*)\/$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: request.uri.slice(0, -1) + querystring,
        }],
      },
    };
    callback(null, response);
  }
  // Test uppercase redirect to lower
  else if (/(.*[A-Z].*)/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: request.uri.toLowerCase() + querystring,
        }],
      },
    };
    callback(null, response);
  }

  /**
   *    SLUTROULETTE SPECIFIC
   */
  else if (/^\/(de|it|es|fr|pt|sw|nl)(?:\/(.*))?$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(de|it|es|fr|pt|sw|nl)(?:\/(.*))?$/);
    var subdomain = matches[1]+".";
    var slug = matches[2] ? "/"+matches[2] : "";

    if (
      subdomain === "sw." ||
      subdomain === "nl."
    ) {
      subdomain = "";
      slug = "";
    }

    var value = "https://" + subdomain+request.origin.custom.customHeaders["x-request-host"][0].value + slug + querystring;

    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: value,
        }],
      },
    };
    callback(null, response);
  }

  callback(null, request);
};
