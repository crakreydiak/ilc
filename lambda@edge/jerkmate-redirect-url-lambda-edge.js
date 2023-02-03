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
  var hostname = "cl.jerkmate";
  var streamate_profile_thumb = "m1.nsimg.net";
  var querystring = "";

  //Check if we are in staging and use staging URLs
  if (request.origin.custom.customHeaders["x-request-host"][0].value.includes("staging")) {
    assets_bucket = "assets-craklabel-staging.s3.amazonaws.com";
    mfe_static = "cdncl-staging.jerkmate.com";
    video_thumbnail_hostname = "camshub-video-thumbnail-scraper-staging.s3.amazonaws.com";
  }

  /***********************************
   *      CRAKLABEL SPECIFIC
   ***********************************/

  if (request.querystring) {
    querystring = "?"+request.querystring;
  }

  //For English use jerkmate
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
    if (language.includes("jerkmate")) {
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
    if (language.includes("jerkmate")) {
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
    console.log("request", request);

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
  else if (/^\/(perf-thumb)\/(.*)/.test(request.uri)) {
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

  /***********************************
   *      JERKMATE SPECIFIC
   ***********************************/
  else if (/^\/(blog)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://blog.jerkmate.com",
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(blog)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(blog)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://blog.jerkmate.com/"+matches[2],
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("jerkmate") && /^\/cams(\/$|$)/g.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/girl" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("de") && /^\/cams(\/$|$)/g.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/frauen" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("fr") && /^\/webcams(\/$|$)/g.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/webcams/femme" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("es") && /^\/webcams(\/$|$)/g.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/webcams/chicas" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("it") && /^\/cams(\/$|$)/g.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/donne" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("pt") && /^\/webcams(\/$|$)/g.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/webcams/mulheres" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("jerkmate") && /^\/cams\/girl\/domi(\/$|$)/g.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/girl/dominant" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("jerkmate") && /^\/cams\/girl\/dp(\/$|$)/g.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/girl/double-penetration" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("jerkmate") && /^\/cams\/male\/dominant(\/$|$)/g.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/male/domination" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("jerkmate") && /^\/cams\/couple\/bondage(\/$|$)/g.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/couple/bdsm" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("jerkmate") && /^\/games\/jewelz-blu/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/pornstar/jewelz-blu" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("fr") && /^\/jeux\/jewelz-blu/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/pornstar/jewelz-blu" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("de") && /^\/spiele\/jewelz-blu/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/pornostar/jewelz-blu" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("es") && /^\/juegos\/jewelz-blu/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/estrella-porno/jewelz-blu" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("it") && /^\/giochi\/jewelz-blu/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/pornostar/jewelz-blu" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("pt") && /^\/jogos\/jewelz-blu/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/estrela-porno/jewelz-blu" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("jerkmate") && /^\/games\/(.*)/.test(request.uri)) {
    const matches = request.uri.match(/^\/games\/(.*)/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/pornstar/" + matches[1] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("fr") && /^\/jeux\/(.*)/.test(request.uri)) {
    const matches = request.uri.match(/^\/jeux\/(.*)/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/pornstar/" + matches[1] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("de") && /^\/spiele\/(.*)/.test(request.uri)) {
    const matches = request.uri.match(/^\/spiele\/(.*)/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/pornostar/" + matches[1] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("es") && /^\/juegos\/(.*)/.test(request.uri)) {
    const matches = request.uri.match(/^\/juegos\/(.*)/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/estrella-porno/" + matches[1] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("it") && /^\/giochi\/(.*)/.test(request.uri)) {
    const matches = request.uri.match(/^\/giochi\/(.*)/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/pornostar/" + matches[1] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (language.includes("pt") && /^\/jogos\/(.*)/.test(request.uri)) {
    const matches = request.uri.match(/^\/jogos\/(.*)/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/estrela-porno/" + matches[1] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(pornstar)\/(savannah-six)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/pornstar/savannah-sixx" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(pornstar)\/(gabby-carter)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/pornstar/gabbie-carter" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(pornstar)\/(adriana-chechick)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/pornstar/adriana-chechik" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(tag)\/(big-boobs)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/girl/big-tits" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(tag)\/(couple)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/couple" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(tag)\/(feet)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/girl/foot-fetish" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(tag)\/(female)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/girl" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(tag)\/(pornstar)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/girl" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(tag)\/(pregnant)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/girl" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(tag)\/(trans)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/trans" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(es)\/(tag)\/(pies)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "es." + request.origin.custom.customHeaders["x-request-host"][0].value + "/webcams/chicas/fetiche-pies" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(es)\/(tag)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(es)\/(tag)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "/webcams/chicas/"+matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(fr)\/(tag)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(fr)\/(tag)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "/webcams/femme/"+matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(it)\/(tag)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(it)\/(tag)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "/cams/donne/"+matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(pt)\/(tag)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(pt)\/(tag)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "/webcams/mulheres/"+matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(tag)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(tag)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/girl/"+matches[2] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(de|it)\/(trans)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(de|it)\/(trans)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value +"/cams/trans" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(fr|es|pt)\/(trans)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(fr|es|pt)\/(trans)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value +"/webcams/trans" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(trans)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/trans" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(women)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/girl" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/gay.html/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/male/gay" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/milf.html/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/girl/milf" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/trans.html/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/trans" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(pt)\/(casal)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(pt)\/(casal)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "/webcams/casal" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(pt)\/(femea)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(pt)\/(femea)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "/webcams/mulheres" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(pt)\/(masculino)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(pt)\/(masculino)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "/webcams/homen" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(pt)\/(model)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(pt)\/(model)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "cam/" + matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(de)\/(model)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(de)\/(model)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "cam/" + matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(es)\/(model)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(es)\/(model)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "webcam/" + matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(fr)\/(model)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(fr)\/(model)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "webcam/" + matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(it)\/(model)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(it)\/(model)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "cam/" + matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(model)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(model)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://jerkmate.com/cam/"+matches[2] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(men)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/male" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(es)\/(pornstar)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(es)\/(pornstar)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0]+"/estrella-porno/"+matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(pt)\/(pornstar)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(pt)\/(pornstar)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0]+"/estrela-porno/"+matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(fr)\/(pornstar)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(fr)\/(pornstar)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0]+"/pornstar/"+matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(de|it)\/(pornstar)\/(.*)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(de|it)\/(pornstar)\/(.*)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0]+"/pornostar/"+matches[3] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(de|it|es|fr|pt)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(de|it|es|fr|pt)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(couples)$/.test(request.uri)) {
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "/cams/couple" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(de)\/(frau)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(de)\/(frau)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "cams/frauen" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(de)\/(manner)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(de)\/(manner)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "cams/mann" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(de)\/(paar)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(de)\/(paar)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "cams/" + matches[2] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(es)\/(hombre)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(es)\/(hombre)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "webcams/" + matches[2] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(es)\/(mujer)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(es)\/(mujer)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "webcams/chicas" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(es)\/(pareja)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(es)\/(pareja)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "webcams/" + matches[2] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(fr)\/(couples)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(fr)\/(couples)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "webcams/couple" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(fr)\/(femmes)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(fr)\/(femmes)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "webcams/femme" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(fr)\/(hommes)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(fr)\/(hommes)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "webcams/homme" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(it)\/(coppia)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(it)\/(coppia)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "cams/" + matches[2] + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(it)\/(donna)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(it)\/(donna)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "cams/donne" + querystring,
        }],
      },
    };
    callback(null, response);
  }
  else if (/^\/(it)\/(uomo)$/.test(request.uri)) {
    const matches = request.uri.match(/^\/(it)\/(uomo)$/);
    const response = {
      status: '301',
      statusDescription: 'Moved Permanently',
      headers: {
        location: [{
          key: 'Location',
          value: "https://"+matches[1]+"."+request.origin.custom.customHeaders["x-request-host"][0].value + "cams/" + matches[2] + querystring,
        }],
      },
    };
    callback(null, response);
  }

  callback(null, request);
};
