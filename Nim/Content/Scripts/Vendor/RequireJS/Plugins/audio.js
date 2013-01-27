define(function () {
    var privates = {
        createXhr: function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) { }

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },
        parseName: function (name) {
            var strip = false, index = name.indexOf("."),
                modName = name.substring(0, index),
                ext = name.substring(index + 1, name.length);

            index = ext.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = ext.substring(index + 1, ext.length);
                strip = strip === "strip";
                ext = ext.substring(0, index);
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        }
    };

    return {
        cache: {},
        audioContext: new webkitAudioContext(),
        normalize: function (name, normalize) {
            return name + "?" + (new Date().getTime());
        },
        load: function (name, req, load, config) {
            var xhr = privates.createXhr(),
                url = (function (req, name) {
                    var url = req.toUrl(name);
                    url = url.substring(0, url.indexOf("?"));
                    return url;
                } (req, name)),
                cache = this.cache,
                audioContext = this.audioContext;

            if (!cache[url]) {
                xhr.open("GET", url, true);
                xhr.responseType = "arraybuffer";
                xhr.onreadystatechange = function (evt) {
                    var status, err;
                    //Do not explicitly handle errors, those should be
                    //visible via console output in the browser.
                    if (xhr.readyState === 4) {
                        status = xhr.status;
                        if (status > 399 && status < 600) {
                            //An http 4xx or 5xx error. Signal an error.
                            err = new Error(url + ' HTTP status: ' + status);
                            err.xhr = xhr;
                            //  errback(err);
                        } else {
                            cache[url] = xhr.response;
                            audioContext.decodeAudioData(cache[url], function (buffer) {
                                var source = audioContext.createBufferSource(); // creates a sound source
                                source.buffer = buffer;                    // tell the source which sound to play
                                source.connect(audioContext.destination);       // connect the source to the context's destination (the speakers)

                                load(source);
                            });
                        }
                    }
                };
                xhr.send(null);
            } else {
                audioContext.decodeAudioData(cache[url], function (buffer) {
                    var source = audioContext.createBufferSource(); // creates a sound source
                    source.buffer = buffer;                    // tell the source which sound to play
                    source.connect(audioContext.destination);       // connect the source to the context's destination (the speakers)

                    load(source);
                });
            }
        }
    };

});
